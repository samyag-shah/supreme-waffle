import { NextRequest, NextResponse } from "next/server";

const authRoutes = [
  "/user/signin",
  "/user/signup",
  "/owner/signup",
  "/owner/signin",
];
const protectedRoutes = ["/owner", "/myBookings"];
const ownerRoutes = ["/owner"];
const userRoutes = ["/myBookings"];

//const publicPaths = ['/']
interface type {
  userType: string;
}

type type1 = type | undefined;

export function middleware(request: NextRequest) {
  //console.log({"cookie" : request.cookies.get("currentUser")?.value || ""})
  let currentUser = request.cookies.get("currentUser")?.value;
  // let currentUser:type1 = JSON.parse({
  //     "email": "abc"
  //   })
  //console.log({currentUser})
  //console.log({path: request.nextUrl.pathname})

  if (currentUser) {
    //console.log(currentUser)
    let currentUser1: type1 = JSON.parse(currentUser);
    //currentUser = currentUser ?  JSON.parse(currentUser) as Object : undefined
    if (currentUser1) {
      if (currentUser1.userType === "user") {
        if (authRoutes.includes(request.nextUrl.pathname) && currentUser) {
          return NextResponse.redirect(new URL("/", request.url));
        } else if (
          ownerRoutes.includes(request.nextUrl.pathname) &&
          currentUser
        ) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } else if (currentUser1?.userType === "owner") {
        if (authRoutes.includes(request.nextUrl.pathname) && currentUser) {
          return NextResponse.redirect(new URL("/owner", request.url));
        } else if (
          userRoutes.includes(request.nextUrl.pathname) &&
          currentUser
        ) {
          return NextResponse.redirect(new URL("/owner", request.url));
        }
      }
    }
  } else {
    if (protectedRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
