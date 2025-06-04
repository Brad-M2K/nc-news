## 🛠 Environment Setup

To run this project locally, create the following files in the **root** directory:

- `.env.test`  
  ```
  PGDATABASE=nc_news_test
  ```
- `.env.development`  
  ```
  PGDATABASE=nc_news
  ```

✅ **Make sure your `.gitignore` includes `.env.*`**

## Entity Relationship Diagram - Database
[![Database Diagram Preview](./docs/nc-news-erd-diagram-thumb.png)](./docs/nc-news-erd-diagram.png)

[LINK](https://dbdiagram.io/d/NC-News-683992adbd74709cb74712d4) to live diagram for better view  (broken link currently sorry)


---

## 💡 Developer Tips

This project uses the **Better Comments** extension in VS Code to improve in-editor readability.

> 💬 Comments in the code are color-coded based on type:  
> - `// TODO:` = 🟡 To-Do  
> - `// !` = 🔴 Warning  
> - `// ?` = 🔵 Question  
> - `// *` = 🟢 Highlight

🔧 You can install this from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) to see annotations as intended.
