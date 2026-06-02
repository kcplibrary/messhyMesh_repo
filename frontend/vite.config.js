import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Configure the React plugin to handle custom native web components
      template: {
        compilerOptions: {
          // Instructs the compiler to treat spline-viewer as a native HTML tag rather than a React component
          isCustomElement: (tag) => tag === 'spline-viewer',
        },
      },
    }),
  ],
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
