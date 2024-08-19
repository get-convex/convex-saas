import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "../ui/logo";
import { cn } from "@/utils/misc";
import { buttonVariants } from "@/ui/button-util";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/ui/button";
import siteConfig from "~/site.config";
import { ThemeSwitcherHome } from "@/ui/theme-switcher";
import ShadowPNG from "/images/shadow.png";
import { useConvexAuth } from "@convex-dev/react-query";
import { Route as AuthLoginRoute } from "@/routes/_app/login/_layout.index";
import { Route as DashboardRoute } from "@/routes/_app/_auth/dashboard/_layout.index";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const theme = "dark";
  return (
    <div className="relative flex h-full w-full flex-col bg-card">
      {/* Navigation */}
      <div className="sticky top-0 z-50 mx-auto flex w-full max-w-screen-lg items-center justify-between p-6 py-3">
        <Link to="/" className="flex h-10 items-center gap-1">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/get-convex/convex-saas/tree/main/docs"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "group flex gap-3 px-0 text-primary/80 hover:text-primary hover:no-underline",
              )}
            >
              Docs
            </a>
            <a
              href="https://github.com/get-convex/convex-saas"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "group flex gap-3 px-0 text-primary/80 hover:text-primary hover:no-underline",
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary/80"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="hidden select-none items-center gap-1 rounded-full bg-green-500/5 px-2 py-1 pr-2.5 text-xs font-medium tracking-tight text-green-600 ring-1 ring-inset ring-green-600/20 backdrop-blur-sm dark:bg-yellow-800/40 dark:text-yellow-100 dark:ring-yellow-200/50 md:flex">
                <Star
                  className="h-3 w-3 text-green-600 dark:text-yellow-100"
                  fill="currentColor"
                />
                Star Us on GitHub
              </span>
            </a>
          </div>
          <a
            href="https://twitter.com/convex_dev"
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center"
          >
            <svg
              className="h-[18px] w-[18px] text-primary"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.5 0.5H5.75L9.48421 5.71053L14 0.5H16L10.3895 6.97368L16.5 15.5H11.25L7.51579 10.2895L3 15.5H1L6.61053 9.02632L0.5 0.5ZM12.0204 14L3.42043 2H4.97957L13.5796 14H12.0204Z"
                fill="currentColor"
              />
            </svg>
          </a>
          <Link
            to={
              isAuthenticated
                ? DashboardRoute.fullPath
                : AuthLoginRoute.fullPath
            }
            className={buttonVariants({ size: "sm" })}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin w-16 h-4" />}
            {!isLoading && isAuthenticated && "Dashboard"}
            {!isLoading && !isAuthenticated && "Get Started"}
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="z-10 mx-auto flex w-full max-w-screen-lg flex-col gap-4 px-6">
        <div className="z-10 flex h-full w-full flex-col items-center justify-center gap-4 p-12 md:p-24">
          <Button
            variant="outline"
            className={cn(
              "hidden h-8 rounded-full bg-white/40 px-3 text-sm font-bold backdrop-blur hover:text-primary dark:bg-secondary md:flex",
            )}
          >
            <span className="flex items-center font-medium text-primary/60">
              Introducing
              <svg
                className="mx-1 h-[14px] w-[14px] text-primary"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.5 0.5H5.75L9.48421 5.71053L14 0.5H16L10.3895 6.97368L16.5 15.5H11.25L7.51579 10.2895L3 15.5H1L6.61053 9.02632L0.5 0.5ZM12.0204 14L3.42043 2H4.97957L13.5796 14H12.0204Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            {siteConfig.siteTitle}
          </Button>
          <h1 className="text-center text-6xl font-bold leading-tight text-primary md:text-7xl lg:leading-tight">
            Production Ready
            <br />
            SaaS Stack for Convex
          </h1>
          <p className="max-w-screen-md text-center text-lg !leading-normal text-muted-foreground md:text-xl">
            Launch in hours with a modern{" "}
            <span className="font-medium text-primary">
              Production-Ready Stack
            </span>
            <br className="hidden lg:inline-block" /> Stripe integration.
            TanStack-powered. Open Source.
          </p>
          <div className="mt-2 flex w-full items-center justify-center gap-2">
            <Link
              to={AuthLoginRoute.fullPath}
              className={cn(buttonVariants({ size: "sm" }), "hidden sm:flex")}
            >
              Get Started
            </Link>
            <a
              href="https://github.com/get-convex/convex-saas/tree/main/docs"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "hidden dark:bg-secondary dark:hover:opacity-80 sm:flex",
              )}
            >
              Explore Documentation
            </a>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <h2 className="text-center font-serif text-xl font-medium text-primary/60">
            Built for Developers
          </h2>
          <div className="my-8 flex flex-wrap items-center justify-center gap-10 gap-y-8 lg:gap-14">
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="Convex"
              className="flex items-center text-primary opacity-80 grayscale transition hover:opacity-100"
              href="https://convex.dev/c/remixsaastemplate"
            >
              <div className="relative flex h-6 w-[148px] items-center justify-center">
                <svg
                  width="382"
                  height="146"
                  viewBox="0 0 382 146"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute h-20 w-auto"
                >
                  <path
                    d="M114.794 86.6648C111.454 83.6785 109.784 79.2644 109.784 73.434C109.784 67.6036 111.487 63.1896 114.896 60.2033C118.301 57.217 122.959 55.721 128.865 55.721C131.319 55.721 133.486 55.8973 135.372 56.2613C137.258 56.6197 139.063 57.2283 140.786 58.0929V67.5524C138.106 66.2157 135.064 65.5445 131.659 65.5445C128.66 65.5445 126.445 66.1417 125.018 67.3363C123.586 68.5308 122.873 70.5615 122.873 73.434C122.873 76.2099 123.575 78.2178 124.986 79.4578C126.391 80.7035 128.617 81.3236 131.665 81.3236C134.891 81.3236 137.955 80.5329 140.862 78.9573V88.8547C137.636 90.3849 133.615 91.1471 128.801 91.1471C122.797 91.1471 118.133 89.6511 114.794 86.6648Z"
                    fill="currentColor"
                  />
                  <path
                    d="M143.77 73.4279C143.77 67.643 145.337 63.246 148.471 60.2312C151.605 57.2165 156.328 55.7148 162.645 55.7148C169.006 55.7148 173.761 57.2222 176.922 60.2312C180.078 63.2403 181.656 67.643 181.656 73.4279C181.656 85.2366 175.318 91.1409 162.645 91.1409C150.06 91.1466 143.77 85.2423 143.77 73.4279ZM167.179 79.4574C168.109 78.2116 168.574 76.2037 168.574 73.4335C168.574 70.7089 168.109 68.7123 167.179 67.4439C166.25 66.1754 164.737 65.544 162.645 65.544C160.603 65.544 159.122 66.1811 158.214 67.4439C157.306 68.7123 156.853 70.7089 156.853 73.4335C156.853 76.2094 157.306 78.2173 158.214 79.4574C159.122 80.7031 160.597 81.3231 162.645 81.3231C164.737 81.3231 166.244 80.6974 167.179 79.4574Z"
                    fill="currentColor"
                  />
                  <path
                    d="M184.638 56.4315H196.629L196.97 59.014C198.288 58.0583 199.969 57.2677 202.011 56.6477C204.054 56.0276 206.167 55.7148 208.35 55.7148C212.392 55.7148 215.343 56.7671 217.207 58.8718C219.071 60.9764 220.001 64.2244 220.001 68.627V90.4299H207.194V69.9865C207.194 68.4564 206.864 67.3585 206.205 66.6873C205.546 66.0161 204.443 65.6862 202.898 65.6862C201.947 65.6862 200.968 65.9137 199.969 66.3688C198.969 66.8239 198.131 67.4097 197.445 68.1265V90.4299H184.638V56.4315Z"
                    fill="currentColor"
                  />
                  <path
                    d="M220.038 56.4317H233.391L239.524 76.3689L245.658 56.4317H259.011L246.268 90.4301H232.775L220.038 56.4317Z"
                    fill="currentColor"
                  />
                  <path
                    d="M263.043 87.5062C259.195 84.4687 257.396 79.1957 257.396 73.5018C257.396 67.9558 258.828 63.3882 262.097 60.2312C265.366 57.0743 270.349 55.7148 276.639 55.7148C282.426 55.7148 286.976 57.1255 290.3 59.9468C293.618 62.7682 295.282 66.6191 295.282 71.4939V77.4494H270.927C271.532 79.2184 272.299 80.4983 274.185 81.289C276.071 82.0796 278.703 82.4721 282.07 82.4721C284.08 82.4721 286.133 82.3071 288.219 81.9715C288.954 81.8521 290.165 81.6644 290.802 81.5222V89.7871C287.619 90.6972 283.377 91.1523 278.595 91.1523C272.159 91.1466 266.89 90.5437 263.043 87.5062ZM281.826 70.1344C281.826 68.4507 279.984 64.8273 276.282 64.8273C272.942 64.8273 270.738 68.3938 270.738 70.1344H281.826Z"
                    fill="currentColor"
                  />
                  <path
                    d="M305.338 73.1437L293.346 56.4317H307.245L331.773 90.4301H317.74L312.287 82.825L306.835 90.4301H292.865L305.338 73.1437Z"
                    fill="currentColor"
                  />
                  <path
                    d="M317.431 56.4317H331.265L320.647 71.3178L313.622 61.7787L317.431 56.4317Z"
                    fill="currentColor"
                  />
                  <path
                    d="M82.2808 87.6517C89.652 86.8381 96.6012 82.9353 100.427 76.4211C98.6156 92.5331 80.8853 102.717 66.413 96.4643C65.0795 95.8897 63.9316 94.9339 63.1438 93.705C59.8915 88.6302 58.8224 82.1729 60.3585 76.313C64.7475 83.8399 73.6717 88.4539 82.2808 87.6517Z"
                    fill="currentColor"
                  />
                  <path
                    d="M60.0895 71.5852C57.1016 78.4464 56.9722 86.4797 60.6353 93.0906C47.7442 83.453 47.8848 62.8294 60.4778 53.2885C61.6425 52.4067 63.0267 51.8833 64.4785 51.8036C70.4486 51.4907 76.5144 53.7835 80.7683 58.0561C72.1254 58.1415 63.7076 63.643 60.0895 71.5852Z"
                    fill="currentColor"
                  />
                  <path
                    d="M84.9366 60.1673C80.5757 54.1253 73.7503 50.0119 66.2722 49.8868C80.7277 43.3669 98.5086 53.9375 100.444 69.5659C100.624 71.0167 100.388 72.4959 99.7409 73.8044C97.04 79.2547 92.032 83.4819 86.1801 85.0464C90.4678 77.144 89.9388 67.4894 84.9366 60.1673Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="TanStack"
              className="flex items-center text-primary opacity-80 grayscale transition hover:opacity-100"
              href="https://tanstack.com/?utm_source=remixconvexsaas"
            >
              <svg
                className="h-12 w-auto"
                viewBox="0 0 633 633"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="316.5" cy="316.5" r="316.5" fill="#fff" />
                <mask
                  id="a"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="633"
                  height="633"
                >
                  <circle cx="316.5" cy="316.5" r="316.5" fill="#fff" />
                </mask>
                <g mask="url(#a)" stroke="#000">
                  <path
                    d="M304 610.5c0 101.183-94.405 185.968-214.5 185.968S-125 711.683-125 610.5c0-101.183 94.405-185.968 214.5-185.968S304 509.317 304 610.5ZM758 610.5c0 101.183-94.405 185.968-214.5 185.968S329 711.683 329 610.5c0-101.183 94.405-185.968 214.5-185.968S758 509.317 758 610.5Z"
                    strokeWidth="25"
                  />
                  <path
                    d="M304 648.5c0 101.183-94.405 185.968-214.5 185.968S-125 749.683-125 648.5c0-101.183 94.405-185.968 214.5-185.968S304 547.317 304 648.5ZM758 648.5c0 101.183-94.405 185.968-214.5 185.968S329 749.683 329 648.5c0-101.183 94.405-185.968 214.5-185.968S758 547.317 758 648.5Z"
                    strokeWidth="25"
                  />
                  <path
                    d="M304 684.5c0 101.183-94.405 185.968-214.5 185.968S-125 785.683-125 684.5c0-101.183 94.405-185.968 214.5-185.968S304 583.317 304 684.5ZM758 684.5c0 101.183-94.405 185.968-214.5 185.968S329 785.683 329 684.5c0-101.183 94.405-185.968 214.5-185.968S758 583.317 758 684.5Z"
                    strokeWidth="25"
                  />
                  <path
                    d="M570 715.5c0 170.018-115.444 304-253.5 304-138.056 0-253.5-133.982-253.5-304s115.444-304 253.5-304c138.056 0 253.5 133.982 253.5 304Z"
                    fill="#fff"
                    strokeWidth="25"
                  />
                  <circle
                    cx="565.5"
                    cy="89.5"
                    r="102"
                    fill="#fff"
                    strokeWidth="23"
                  />
                  <path
                    d="M428 90h-30M431.5 56.5 405 51M432 123l-29 8M443 154l-24 13M465 181l-20 19M492.373 204l-13.834 22.847M525.5 220.5 518 245M565.5 229.5l.5 24.5"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                </g>
                <circle
                  cx="316.5"
                  cy="316.5"
                  r="304"
                  stroke="#000"
                  strokeWidth="25"
                />
                <mask
                  id="b"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="633"
                  height="633"
                >
                  <circle
                    cx="316.5"
                    cy="316.5"
                    r="304"
                    fill="#fff"
                    stroke="#fff"
                    strokeWidth="25"
                  />
                </mask>
                <g mask="url(#b)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M193.322 202.998c8.069 37.277 13.997 73.63 17.782 109.059 3.785 35.428 2.803 75.151-2.947 119.169l61.232-16.664c-15.624-59.046-25.16-97.899-28.606-116.559-3.447-18.66-10.832-51.846-22.155-99.557l-25.306 4.552"
                    fill="#000"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M195.969 183.898s-12.6-22.116-36.455-29.892c-23.854-7.777-55.501 11.082-55.501 11.082s23.853 21.386 40.686 24.926c16.834 3.54 51.27-6.116 51.27-6.116Z"
                    fill="#fff"
                    stroke="#000"
                    strokeWidth="13"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M195.937 184.501s-47.501-8.529-83.21 15.715c-35.708 24.245-31.59 99.348-31.59 99.348s45.506-41.755 65.244-61.885c19.738-20.129 49.556-53.178 49.556-53.178ZM195.969 183.898s-1.267-32.853 20.633-48.205c21.9-15.351 45.455-15.339 45.455-15.339s-9.096 32.041-25.161 43.356c-16.065 11.314-40.927 20.188-40.927 20.188Z"
                    fill="#fff"
                    stroke="#000"
                    strokeWidth="13"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M195.937 184.501s47.842-45.056 96.703-29.04c48.862 16.015 54.608 59.082 54.608 59.082s-52.758-8.288-75.809-12.088c-23.052-3.799-75.502-17.954-75.502-17.954Z"
                    fill="#fff"
                    stroke="#000"
                    strokeWidth="13"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M195.937 184.501s53.742-11.356 89.19 21.965c35.447 33.321 42.291 80.335 42.291 80.335s-59.636-14.566-85.496-42.37c-25.859-27.804-45.985-59.93-45.985-59.93ZM195.937 184.501s-50.376 20.716-60.134 65.628c-9.759 44.912 8.699 99.613 8.699 99.613s41.077-60.413 47.387-88c6.31-27.586 4.048-77.241 4.048-77.241Z"
                    fill="#fff"
                    stroke="#000"
                    strokeWidth="13"
                  />
                  <path
                    d="M197.456 182.301s-22.221 32.415-30.819 59.39c-8.599 26.976-11.149 45.11-11.149 45.11"
                    stroke="#000"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M195.847 185.673s-36.616 2.587-58.055 21.827c-21.44 19.24-31.304 37.82-31.304 37.82M205.543 176.367s44.562-10.094 67.018-5.047c22.457 5.047 35.843 15.858 35.843 15.858M197.514 181.438s30.388 14.812 53.908 31.917c23.52 17.104 35.078 32.04 35.078 32.04"
                    stroke="#000"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    clipRule="evenodd"
                    d="m345.091 362.996 97.665 17.221s8.677 3.191 7.11 12.082c-1.568 8.891-10.979 9.856-10.979 9.856l-105.971-18.686-57.476-59.21s-4.79-7.263.762-12.81c5.552-5.547 13.675-2.121 13.675-2.121l55.214 53.668Z"
                    stroke="#000"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                  <path
                    d="m437.018 403.22-5.036 28.56M291.97 341.479l-10.94 62.042M333.939 384.126l-4.335 27.079M429.253 384.461l.862-6.495M396.253 379.461l.862-6.495M363.247 373.522l.878-6.109M325.238 351.286l4.166-3.901M304.238 331.286l4.166-3.901"
                    stroke="#000"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  />
                </g>
              </svg>
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="Stripe"
              className="flex items-center text-primary opacity-80 grayscale transition hover:opacity-100"
              href="https://stripe.com"
            >
              <svg
                className="h-8 w-auto"
                viewBox="0 0 60 25"
                xmlns="http://www.w3.org/2000/svg"
                width={60}
                height={25}
              >
                <path
                  fill="currentColor"
                  d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"
                  fillRule="evenodd"
                />
              </svg>
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="TailwindCSS"
              className="flex items-center text-primary opacity-80 grayscale transition hover:opacity-100"
              href="https://tailwindcss.com"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 54 33"
                className="h-8 w-auto"
              >
                <g clipPath="url(#prefix__clip0)">
                  <path
                    fill="#38bdf8"
                    fillRule="evenodd"
                    d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
                    clipRule="evenodd"
                  />
                </g>
                <defs>
                  <clipPath id="prefix__clip0">
                    <path fill="#fff" d="M0 0h54v32.4H0z" />
                  </clipPath>
                </defs>
              </svg>
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="Resend"
              className="flex items-center text-primary opacity-80 grayscale transition hover:opacity-100"
              href="https://resend.com"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 65 16"
                width={60}
                fill="none"
                className="h-6 w-auto"
              >
                <path
                  d="M0.820068 15V1.00001H7.02007C7.88674 1.00001 8.6734 1.20001 9.38007 1.60001C10.0867 1.98668 10.6401 2.51334 11.0401 3.18001C11.4534 3.84668 11.6601 4.60668 11.6601 5.46001C11.6601 6.30001 11.4534 7.06668 11.0401 7.76001C10.6401 8.44001 10.0867 8.98001 9.38007 9.38001C8.6734 9.78001 7.88674 9.98001 7.02007 9.98001H3.72007V15H0.820068ZM8.76007 15L5.20007 8.68001L8.28007 8.18001L12.2401 15.02L8.76007 15ZM3.72007 7.54001H6.88007C7.24007 7.54001 7.5534 7.46001 7.82007 7.30001C8.10007 7.12668 8.3134 6.89334 8.46007 6.60001C8.60673 6.29335 8.68007 5.95335 8.68007 5.58001C8.68007 5.18001 8.5934 4.83335 8.42007 4.54001C8.24674 4.24668 7.9934 4.02001 7.66007 3.86001C7.32674 3.68668 6.94007 3.60001 6.50007 3.60001H3.72007V7.54001Z"
                  fill="currentColor"
                />
                <path
                  d="M18.0534 15.2C16.9067 15.2 15.9 14.9667 15.0333 14.5C14.18 14.0333 13.5134 13.3933 13.0333 12.58C12.5667 11.7667 12.3333 10.8333 12.3333 9.78001C12.3333 8.95335 12.4667 8.20001 12.7333 7.52001C13 6.84001 13.3733 6.25335 13.8533 5.76001C14.3333 5.25335 14.9 4.86668 15.5534 4.60001C16.22 4.32001 16.94 4.18001 17.7134 4.18001C18.4334 4.18001 19.1 4.31335 19.7134 4.58001C20.3267 4.84668 20.8534 5.22001 21.2934 5.70001C21.7467 6.16668 22.0934 6.72668 22.3334 7.38001C22.5734 8.02001 22.68 8.71335 22.6534 9.46001L22.6334 10.34H14.1334L13.6733 8.60001H20.2934L19.9734 8.96001V8.52001C19.9467 8.16001 19.8267 7.84001 19.6133 7.56001C19.4134 7.26668 19.1534 7.04001 18.8334 6.88001C18.5134 6.70668 18.1533 6.62001 17.7533 6.62001C17.1667 6.62001 16.6667 6.73335 16.2533 6.96001C15.8533 7.18668 15.5467 7.52001 15.3333 7.96001C15.12 8.40001 15.0133 8.93335 15.0133 9.56001C15.0133 10.2 15.1467 10.7533 15.4134 11.22C15.6934 11.6867 16.08 12.0533 16.5734 12.32C17.08 12.5733 17.6733 12.7 18.3533 12.7C18.82 12.7 19.2467 12.6267 19.6334 12.48C20.02 12.3333 20.4333 12.08 20.8734 11.72L22.2334 13.62C21.8467 13.9667 21.42 14.26 20.9534 14.5C20.4867 14.7267 20.0067 14.9 19.5133 15.02C19.02 15.14 18.5334 15.2 18.0534 15.2Z"
                  fill="currentColor"
                />
                <path
                  d="M27.3121 15.2C26.3254 15.2 25.4454 15.04 24.6721 14.72C23.9121 14.3867 23.2988 13.9333 22.8321 13.36L24.6121 11.84C25.0121 12.28 25.4654 12.6 25.9721 12.8C26.4788 12.9867 26.9854 13.08 27.4921 13.08C27.6921 13.08 27.8721 13.06 28.0321 13.02C28.2054 12.9667 28.3521 12.9 28.4721 12.82C28.5921 12.7267 28.6788 12.62 28.7321 12.5C28.7988 12.3667 28.8321 12.2267 28.8321 12.08C28.8321 11.7867 28.7121 11.56 28.4721 11.4C28.3388 11.32 28.1321 11.2333 27.8521 11.14C27.5721 11.0333 27.2121 10.92 26.7721 10.8C26.0921 10.6267 25.5121 10.4267 25.0321 10.2C24.5654 9.96001 24.1921 9.69335 23.9121 9.40001C23.6721 9.12001 23.4854 8.82001 23.3521 8.50001C23.2321 8.16668 23.1721 7.80001 23.1721 7.40001C23.1721 6.92001 23.2788 6.48668 23.4921 6.10001C23.7054 5.70001 23.9988 5.36001 24.3721 5.08001C24.7588 4.80001 25.1988 4.58668 25.6921 4.44001C26.1854 4.28001 26.7054 4.20001 27.2521 4.20001C27.7988 4.20001 28.3321 4.26668 28.8521 4.40001C29.3721 4.53335 29.8521 4.72668 30.2921 4.98001C30.7454 5.22001 31.1388 5.50668 31.4721 5.84001L29.9521 7.52001C29.7121 7.29334 29.4388 7.08668 29.1321 6.90001C28.8388 6.71335 28.5321 6.56668 28.2121 6.46001C27.8921 6.35335 27.6054 6.30001 27.3521 6.30001C27.1254 6.30001 26.9188 6.32001 26.7321 6.36001C26.5588 6.40001 26.4121 6.46668 26.2921 6.56001C26.1721 6.64001 26.0788 6.74001 26.0121 6.86001C25.9588 6.98001 25.9321 7.11334 25.9321 7.26001C25.9321 7.40668 25.9654 7.54668 26.0321 7.68001C26.1121 7.81335 26.2188 7.92668 26.3521 8.02001C26.4988 8.10001 26.7121 8.19335 26.9921 8.30001C27.2854 8.40668 27.6788 8.52668 28.1721 8.66001C28.8121 8.83335 29.3521 9.02668 29.7921 9.24001C30.2454 9.45335 30.6054 9.70001 30.8721 9.98001C31.0988 10.22 31.2654 10.4933 31.3721 10.8C31.4788 11.1067 31.5321 11.4467 31.5321 11.82C31.5321 12.4733 31.3454 13.0533 30.9721 13.56C30.6121 14.0667 30.1121 14.4667 29.4721 14.76C28.8321 15.0533 28.1121 15.2 27.3121 15.2Z"
                  fill="currentColor"
                />
                <path
                  d="M37.5768 15.2C36.4301 15.2 35.4235 14.9667 34.5568 14.5C33.7035 14.0333 33.0368 13.3933 32.5568 12.58C32.0901 11.7667 31.8568 10.8333 31.8568 9.78001C31.8568 8.95335 31.9901 8.20001 32.2568 7.52001C32.5235 6.84001 32.8968 6.25335 33.3768 5.76001C33.8568 5.25335 34.4235 4.86668 35.0768 4.60001C35.7435 4.32001 36.4635 4.18001 37.2368 4.18001C37.9568 4.18001 38.6235 4.31335 39.2368 4.58001C39.8501 4.84668 40.3768 5.22001 40.8168 5.70001C41.2701 6.16668 41.6168 6.72668 41.8568 7.38001C42.0968 8.02001 42.2035 8.71335 42.1768 9.46001L42.1568 10.34H33.6568L33.1968 8.60001H39.8168L39.4968 8.96001V8.52001C39.4701 8.16001 39.3501 7.84001 39.1368 7.56001C38.9368 7.26668 38.6768 7.04001 38.3568 6.88001C38.0368 6.70668 37.6768 6.62001 37.2768 6.62001C36.6901 6.62001 36.1901 6.73335 35.7768 6.96001C35.3768 7.18668 35.0701 7.52001 34.8568 7.96001C34.6435 8.40001 34.5368 8.93335 34.5368 9.56001C34.5368 10.2 34.6701 10.7533 34.9368 11.22C35.2168 11.6867 35.6035 12.0533 36.0968 12.32C36.6035 12.5733 37.1968 12.7 37.8768 12.7C38.3435 12.7 38.7701 12.6267 39.1568 12.48C39.5435 12.3333 39.9568 12.08 40.3968 11.72L41.7568 13.62C41.3701 13.9667 40.9435 14.26 40.4768 14.5C40.0101 14.7267 39.5301 14.9 39.0368 15.02C38.5435 15.14 38.0568 15.2 37.5768 15.2Z"
                  fill="currentColor"
                />
                <path
                  d="M43.2755 15V4.42001H45.9955L46.0755 6.58001L45.5155 6.82001C45.6622 6.34001 45.9222 5.90668 46.2955 5.52001C46.6822 5.12001 47.1422 4.80001 47.6755 4.56001C48.2089 4.32001 48.7689 4.20001 49.3555 4.20001C50.1555 4.20001 50.8222 4.36001 51.3555 4.68001C51.9022 5.00001 52.3089 5.48668 52.5755 6.14001C52.8555 6.78001 52.9955 7.57335 52.9955 8.52001V15H50.1555V8.74001C50.1555 8.26001 50.0889 7.86001 49.9555 7.54001C49.8222 7.22001 49.6155 6.98668 49.3355 6.84001C49.0689 6.69334 48.7355 6.62668 48.3355 6.64001C48.0155 6.64001 47.7155 6.69335 47.4355 6.80001C47.1689 6.89334 46.9355 7.03335 46.7355 7.22001C46.5489 7.40668 46.3955 7.62001 46.2755 7.86001C46.1689 8.10001 46.1155 8.36001 46.1155 8.64001V15H44.7155C44.4089 15 44.1355 15 43.8955 15C43.6555 15 43.4489 15 43.2755 15Z"
                  fill="currentColor"
                />
                <path
                  d="M58.8569 15.2C57.9236 15.2 57.0903 14.9667 56.3569 14.5C55.6369 14.02 55.0636 13.3733 54.6369 12.56C54.2236 11.7333 54.0169 10.78 54.0169 9.70001C54.0169 8.64668 54.2236 7.70668 54.6369 6.88001C55.0636 6.04001 55.6369 5.38668 56.3569 4.92001C57.0903 4.44001 57.9236 4.20001 58.8569 4.20001C59.3503 4.20001 59.8236 4.28001 60.2769 4.44001C60.7436 4.58668 61.1569 4.79335 61.5169 5.06001C61.8903 5.32668 62.1903 5.62668 62.4169 5.96001C62.6436 6.28001 62.7703 6.61335 62.7969 6.96001L62.0769 7.10001V0.200012H64.9369V15H62.2369L62.1169 12.56L62.6769 12.62C62.6503 12.9533 62.5303 13.2733 62.3169 13.58C62.1036 13.8867 61.8169 14.1667 61.4569 14.42C61.1103 14.66 60.7103 14.8533 60.2569 15C59.8169 15.1333 59.3503 15.2 58.8569 15.2ZM59.4969 12.84C60.0303 12.84 60.4969 12.7067 60.8969 12.44C61.2969 12.1733 61.6103 11.8067 61.8369 11.34C62.0636 10.8733 62.1769 10.3267 62.1769 9.70001C62.1769 9.08668 62.0636 8.54668 61.8369 8.08001C61.6103 7.61335 61.2969 7.24668 60.8969 6.98001C60.4969 6.71335 60.0303 6.58001 59.4969 6.58001C58.9636 6.58001 58.4969 6.71335 58.0969 6.98001C57.7103 7.24668 57.4036 7.61335 57.1769 8.08001C56.9636 8.54668 56.8569 9.08668 56.8569 9.70001C56.8569 10.3267 56.9636 10.8733 57.1769 11.34C57.4036 11.8067 57.7103 12.1733 58.0969 12.44C58.4969 12.7067 58.9636 12.84 59.4969 12.84Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="shadcn/ui"
              className="flex items-center text-primary opacity-80 grayscale transition hover:opacity-100"
              href="https://ui.shadcn.com/"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                className="h-10 w-10"
              >
                <rect width={256} height={256} fill="none" />
                <line
                  x1={208}
                  y1={128}
                  x2={128}
                  y2={208}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={16}
                />
                <line
                  x1={192}
                  y1={40}
                  x2={40}
                  y2={192}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={16}
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="relative z-10 flex flex-col border border-border backdrop-blur-sm lg:flex-row">
          <div className="flex w-full flex-col items-start justify-center gap-6 border-r border-primary/10 p-10 lg:p-12">
            <p className="h-14 text-lg text-primary/60">
              <span className="font-semibold text-primary">
                Production Ready.
              </span>{" "}
              Build your app on a solid, scalable, well-tested foundation.
            </p>
            <Link
              to={AuthLoginRoute.fullPath}
              className={buttonVariants({ size: "sm" })}
            >
              Get Started
            </Link>
          </div>
          <div className="flex w-full flex-col items-start justify-center gap-6 p-10 lg:w-[60%] lg:border-b-0 lg:p-12">
            <p className="h-14 text-lg text-primary/60">
              <span className="font-semibold text-primary">Ready to Ship.</span>{" "}
              Deployments ready with a single command.
            </p>
            <a
              href="https://github.com/get-convex/convex-saas/tree/main/docs"
              target="_blank"
              rel="noreferrer"
              className={cn(
                `${buttonVariants({ variant: "outline", size: "sm" })} dark:bg-secondary dark:hover:opacity-80`,
              )}
            >
              Explore Documentation
            </a>
          </div>

          <div className="absolute left-0 top-0 z-10 flex flex-col items-center justify-center">
            <span className="absolute h-6 w-[1px] bg-primary/40" />
            <span className="absolute h-[1px] w-6 bg-primary/40" />
          </div>
          <div className="absolute bottom-0 right-0 z-10 flex flex-col items-center justify-center">
            <span className="absolute h-6 w-[1px] bg-primary/40" />
            <span className="absolute h-[1px] w-6 bg-primary/40" />
          </div>
        </div>
        <div className="z-10 flex h-full w-full flex-col items-center justify-center gap-6 p-12">
          <h1 className="text-center text-4xl font-bold leading-tight text-primary md:text-6xl">
            Proudly Open Source
          </h1>
          <p className="text-center text-lg text-primary/60">
            Convex SaaS is a fully Open Source project.
            <br />
            The code is available on GitHub.
          </p>
          <a
            href="https://github.com/get-convex/convex-saas"
            target="_blank"
            rel="noreferrer"
            className="hidden h-10 select-none items-center gap-2 rounded-full bg-green-500/5 px-2 py-1 pr-2.5 text-base font-medium tracking-tight text-green-600 ring-1 ring-inset ring-green-600/20 backdrop-blur-sm dark:bg-yellow-800/40 dark:text-yellow-100 dark:ring-yellow-200/50 md:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600 dark:text-yellow-100"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Star Us on GitHub
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="z-10 flex w-full flex-col items-center justify-center gap-8 py-6">
        <a
          href="https://twitter.com/convex_dev"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center hover:scale-110"
        >
          <svg
            className="h-8 w-8 text-primary"
            strokeLinejoin="round"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.5 0.5H5.75L9.48421 5.71053L14 0.5H16L10.3895 6.97368L16.5 15.5H11.25L7.51579 10.2895L3 15.5H1L6.61053 9.02632L0.5 0.5ZM12.0204 14L3.42043 2H4.97957L13.5796 14H12.0204Z"
              fill="currentColor"
            />
          </svg>
        </a>

        <ThemeSwitcherHome />

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <p className="flex items-center whitespace-nowrap text-center text-sm font-medium text-primary/60">
            Based on&nbsp;
            <a
              href="https://remix-saas.fly.dev"
              target="_blank"
              rel="noreferrer"
              className="flex items-center text-primary hover:text-primary hover:underline"
            >
              the Open-Source Remix SaaS by&nbsp;
            </a>
            <p className="flex items-center whitespace-nowrap text-center text-sm font-medium text-primary/60">
              <a href="https://bento.me/danielkanem?utm_source=remixconvexsaas">
                DanielKanem.
              </a>
            </p>
          </p>
          <p className="flex items-center whitespace-nowrap text-center text-sm font-medium text-primary/60">
            Source code available on&nbsp;{" "}
            <a
              href="https://github.com/get-convex/convex-saas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:text-primary hover:underline"
            >
              GitHub.
            </a>
          </p>
        </div>
      </footer>

      {/* Background */}
      <img
        src={ShadowPNG}
        alt="Hero"
        className={`fixed left-0 top-0 z-0 h-full w-full opacity-60 ${theme === "dark" ? "invert" : ""}`}
      />
      <div className="base-grid fixed h-screen w-screen opacity-40" />
      <div className="fixed bottom-0 h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
    </div>
  );
}
