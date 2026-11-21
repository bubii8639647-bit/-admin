export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const GITHUB_USER = env.GITHUB_USER;
    const GITHUB_TOKEN = env.GITHUB_TOKEN;
    const REPO_NAME = "apk-builder-engine";

    if (url.pathname === "/api/build" && request.method === "POST") {
      try {
        const body = await request.json();
        const { appName, pkgName, zipBase64, iconBase64 } = body;
        const jobId = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        await uploadToGitHub(GITHUB_USER, GITHUB_TOKEN, REPO_NAME, `jobs/${jobId}/site.zip`, zipBase64);

        if (iconBase64) {
          await uploadToGitHub(GITHUB_USER, GITHUB_TOKEN, REPO_NAME, `jobs/${jobId}/icon.png`, iconBase64);
        }

        const dispatchUrl = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/actions/workflows/build.yml/dispatches`;
        const dispatchRes = await fetch(dispatchUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Web2APK-Backend"
          },
          body: JSON.stringify({
            ref: "main",
            inputs: {
              job_id: jobId,
              app_name: appName,
              pkg_name: pkgName,
              has_icon: iconBase64 ? "true" : "false"
            }
          })
        });

        if (!dispatchRes.ok) throw new Error("ไม่สามารถสั่งงานโรงงานสร้าง APK ได้");

        return new Response(JSON.stringify({ success: true, jobId }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    if (url.pathname === "/api/status" && request.method === "GET") {
      const jobId = url.searchParams.get("jobId");
      const runsUrl = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/actions/runs?per_page=10`;

      const res = await fetch(runsUrl, {
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "User-Agent": "Web2APK-Backend"
        }
      });
      const data = await res.json();

      const matchedRun = (data.workflow_runs || []).find(r => r.display_title.includes(jobId));

      if (!matchedRun) {
        return new Response(JSON.stringify({ status: "queued" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({
        status: matchedRun.status,
        conclusion: matchedRun.conclusion,
        downloadPageUrl: matchedRun.html_url
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};

async function uploadToGitHub(user, token, repo, path, contentBase64) {
  const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "Web2APK-Backend"
    },
    body: JSON.stringify({
      message: `Add ${path}`,
      content: contentBase64
    })
  });
  if (!res.ok) throw new Error(`Upload failed: ${path}`);
}
