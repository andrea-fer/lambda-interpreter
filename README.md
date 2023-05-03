# Setup

* Run Vite Server (`npm run dev`)

* Build CodeMirror 6 Language Package (`npm run prepare`)

* Generate ANTLR Files with new Grammar (`antlr4 -Dlanguage=JavaScript lambda.g4 -visitor`)

* Build Project for Deployment by Creating `dist` Folder (`npm run build`)