import {NextResponse} from "next/server"
import { sendResponse } from "./utils/SendResponse"

export async function GET(){
    return sendResponse(200,"Data fetched succefully!",{name:"CalenderApiHealthCheck",message:"Api is running"})
}
