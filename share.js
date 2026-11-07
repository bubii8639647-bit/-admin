
/* ======================================
   GLOBAL APK HUB - SHARE SYSTEM
   Version 1.0
   ====================================== */

const APKShare = (() => {

  const STORAGE_KEY = "global_apk_hub_shared_apps_v1";

  // ตรวจสอบ URL
  function validURL(value) {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }

  // เข้ารหัสข้อมูล APK สำหรับแชร์
  function encode(app) {
    const data = JSON.stringify(app);
    const bytes = new TextEncoder().encode(data);

    let binary = "";
    bytes.forEach(byte => binary += String.fromCharCode(byte));

    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  // ถอดรหัสข้อมูล APK
  function decode(value) {
    const base64 = value
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const binary = atob(base64);
    const bytes = Uint8Array.from(
      binary,
      char => char.charCodeAt(0)
    );

    return JSON.parse(new TextDecoder().decode(bytes));
  }

  // ตรวจสอบข้อมูลก่อนนำเข้า
  function validate(app) {
    if (!app || typeof app !== "object") {
      throw new Error("ข้อมูลไม่ถูกต้อง");
    }

    if (
      typeof app.name !== "string" ||
      !app.name.trim() ||
      app.name.length > 120
    ) {
      throw new Error("ชื่อ APK ไม่ถูกต้อง");
    }

    if (!validURL(app.downloadUrl)) {
      throw new Error("URL ดาวน์โหลดต้องเป็น HTTPS");
    }

    if (
      app.image &&
      !validURL(app.image)
    ) {
      throw new Error("URL รูปภาพไม่ถูกต้อง");
    }

    return {
      id: String(app.id || Date.now()),
      name: app.name.trim(),
      category: String(app.category || "อื่นๆ").slice(0, 50),
      downloadUrl: app.downloadUrl,
      image: app.image || "",
      version: String(app.version || "1.0.0").slice(0, 30),
      size: String(app.size || "").slice(0, 30),
      description: String(app.description || "").slice(0, 1000),
      tag: String(app.tag || "").slice(0, 30)
    };
  }

  // สร้างลิงก์แชร์
  function createLink(app, websiteURL) {
    const cleanApp = validate(app);
    const url = new URL(websiteURL);

    url.searchParams.set("share", encode(cleanApp));

    return url.toString();
  }

  // อ่านข้อมูลจากลิงก์
  function readLink() {
    const params = new URLSearchParams(location.search);
    const value = params.get("share");

    if (!value) return null;
    if (value.length > 10000) {
      throw new Error("ข้อมูลแชร์มีขนาดใหญ่เกินไป");
    }

    return validate(decode(value));
  }

  // อ่านรายการที่บันทึกในเครื่อง
  function getSaved() {
    try {
      const data = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  // บันทึกรายการลงเครื่อง
  function save(app) {
    const cleanApp = validate(app);
    const list = getSaved();

    if (list.some(item =>
      item.downloadUrl === cleanApp.downloadUrl
    )) {
      return false;
    }

    list.unshift(cleanApp);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(list)
    );

    return true;
  }

  return {
    createLink,
    readLink,
    getSaved,
    save,
    validate
  };

})();
