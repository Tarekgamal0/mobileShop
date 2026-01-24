// services/printService.js

export const printDirectly = (htmlContent) => {
  // 1. التحقق من البيئة (هل نحن داخل Electron؟)
  const isElectron = navigator.userAgent.toLowerCase().includes(" electron/");

  if (isElectron && window.ipcRenderer) {
    // --- مسار Electron (الطباعة الصامتة الحقيقية) ---
    console.log("Printing via Electron IPC...");
    window.ipcRenderer.send("print-silent", htmlContent);
  } else {
    // --- مسار المتصفح (Iframe) للتطوير الحالي ---
    console.log("Printing via Browser Iframe...");
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;

    // نسخ التنسيقات لضمان مظهر التقرير
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((style) => style.outerHTML)
      .join("");

    iframeDoc.documentElement.innerHTML = `
      <html>
        <head>${styles}</head>
        <body dir="rtl">${htmlContent}</body>
      </html>
    `;

    setTimeout(() => {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 500);
  }
};
