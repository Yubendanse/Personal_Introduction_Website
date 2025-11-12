import { getConfig } from "@/lib/config";
import { Decrypt } from "@/lib/utils";
import { dateFormat } from "@kasuie/utils";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export const GET = async (req: NextRequest) => {
  const accessToken = req.cookies.get("accessToken");
  if (accessToken?.value) {
    const password = Decrypt(accessToken.value, process.env.PASSWORD);
    if (password === process.env.PASSWORD) {
      const time = dateFormat(new Date(), "YYYY-MM-DD_HH-mm-ss");
      const config = await getConfig(true);
      const headers = new Headers();
      headers.append(
        "Content-Disposition",
        `attachment; filename=config(v_${time}).json`
      );
      headers.append("Content-Type", "application/json");
      return new NextResponse(JSON.stringify(config, null, 2), {
        headers,
      });
    } else {
      return new NextResponse("fail", {
        status: 403,
      });
    }
  } else {
    return new NextResponse("fail", {
      status: 403,
    });
  }
};
