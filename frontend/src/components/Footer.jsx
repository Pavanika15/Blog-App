import { mutedText, divider } from "../styles/common";

function Footer() {
  return (
    <footer className="mt-16 px-6">
      <div className={divider}></div>

      <div className={`${mutedText} text-center py-6`}>
        © {new Date().getFullYear()} MyBlog — Built with React & Node.js
      </div>
    </footer>
  );
}

export default Footer;