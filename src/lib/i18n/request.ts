import { getRequestConfig } from "next-intl/server";
import { i18nConfig } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = i18nConfig.locales.find((l) => l === requested) ?? i18nConfig.defaultLocale;

  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default,
  };
});
