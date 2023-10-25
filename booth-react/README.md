### React startup template

```
npx create-react-app music-room --template typescript
npm install @mui/material @emotion/react @emotion/styled sass @fontsource/roboto @mui/icons-material
npm install dayjs @mui/x-date-pickers
npm install postcss-normalize --save-dev
npm install react-router-dom
npm install rxjs
```

### vercel deployment
```
vercel --build-env SECRET=secret
vercel --prod
```