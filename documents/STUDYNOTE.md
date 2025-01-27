## Setting up

- Node Version - `20.11.1`
- Create Project Command - `npx create-next-app@latest`

## Routing

folder path vs route path

- `study/contact-us/page.tsx` -> `{BASE_URL}/study/contact-us`
- `study/(auth)/login/page.tsx` -> `{BASE_URL}/study/login` -> auth will be removed
- `study/products/[pid]/review/[rid]/page.tsx` -> `{BASE_URL}/study/products/1/review/2` -> `pid` and `rid` can be accessed as param
- `study/[...dynamicPath]/page.tsx` -> `{BASE_URL}/study/*` -> any invalid route

## Styling

- `global.css` will be applied for whole app
- `page.module.css` will be applied for relevant page. Naming convention (`.module.`) is important.
