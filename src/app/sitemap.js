export default function sitemap() {
  const baseUrl = "https://www.krymoz.com";
  const routes = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/blog/latest-tech-updates-you-shouldnt-miss",
    "/blog/googles-latest-ai-update-what-you-need-to-know",
    "/blog/how-to-sync-gmail-contacts-to-iphone-easy-safe-steps",
    "/blog/poco-x2-rear-camera-not-working-fixes-best-gcam-81-setup",
    "/blog/12-tips-to-improve-your-businesss-financial-management",
    "/blog/what-is-a-lut-how-to-use-create-lut-filters-for-video-desktop-mobile",
    "/blog/step-by-step-guide-to-fix-windows-activation-error",
    "/blog/how-to-fix-the-clash-of-clans-black-screen-quick-safe",
    "/blog/how-to-fix-windows-11-widgets-not-working-complete-troubleshooting-guide",
    "/blog/how-to-protect-your-data-on-windows-11",
    "/blog/install-windows-11-on-any-pc-make-bootable-usb-without-tpm",
    "/blog/gta-5-pc-fixes-system-requirements-troubleshooting-guide",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));
}