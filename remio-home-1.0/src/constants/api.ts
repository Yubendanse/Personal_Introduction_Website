export type AmapApisKey = typeof amapApis;
export type OioApisKey = typeof oioApis;

export const amapApis: Record<string, string> = {
  base: "https://restapi.amap.com",
  weather: "/v3/weather/weatherInfo",
  ip: "/v3/ip",
};

export const oioApis: Record<string, string> = {
  base: "https://api.oioweb.cn",
  weather: "/api/weather/GetWeather",
};
