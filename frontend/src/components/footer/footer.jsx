import React from "react";

const Footer = () => {
  return (
    <div className="footer-outer">
      <div className="footer-inner">
        <div className="footer-col">
          <a href="https://github.com/amandayhuang/feud-app" target="_blank">
            <img
              className="footer-image"
              src="favicon.png"
              alt="Feuding Friends Logo"
            />
          </a>
        </div>
        <div className="footer-col">
          <h4 className="footer-title">Feuding Friends</h4>
          <ul className="footer-list">
            <li className="footer-list-item">
              <span>Adam Moftah, frontend development & design</span>
              &nbsp;
              <a href="https://github.com/adammoftah" target="_blank">
                <i class="fab fa-github icon"></i>
              </a>
              &nbsp;
              <a
                href="https://www.linkedin.com/in/adam-moftah/"
                target="_blank"
              >
                <i class="fab fa-linkedin icon"></i>
              </a>
              &nbsp;
              <a href="https://angel.co/u/adam-moftah" target="_blank">
                <i class="fab fa-angellist icon"></i>
              </a>
              &nbsp;
            </li>
            <li className="footer-list-item">
              <span>
                Amanda Huang, <em>team lead, backend development</em>
              </span>
              &nbsp;
              <a href="https://github.com/amandayhuang" target="_blank">
                <i class="fab fa-github icon"></i>
              </a>
              &nbsp;
              <a
                href="https://www.linkedin.com/in/amandayhuang/"
                target="_blank"
              >
                <i class="fab fa-linkedin icon"></i>
              </a>
              &nbsp;
              <a href="https://angel.co/u/ayh" target="_blank">
                <i class="fab fa-angellist icon"></i>
              </a>
              &nbsp;
            </li>
            <li className="footer-list-item">
              <span>
                Jared Meier, <em>frontend lead</em>
              </span>
              &nbsp;
              <a href="https://github.com/jaredmeier" target="_blank">
                <i class="fab fa-github icon"></i>
              </a>
              &nbsp;
              <a href="https://www.linkedin.com/in/jar-m/" target="_blank">
                <i class="fab fa-linkedin icon"></i>
              </a>
              &nbsp;
              <a href="https://angel.co/u/jared-meier" target="_blank">
                <i class="fab fa-angellist icon"></i>
              </a>
              &nbsp;
            </li>
            <li className="footer-list-item">
              <span>
                Nazia Islam, <em>backend development</em>
              </span>
              &nbsp;
              <a href="https://github.com/Naziaislam80" target="_blank">
                <i class="fab fa-github icon"></i>
              </a>
              &nbsp;
              <a
                href="https://www.linkedin.com/in/nazia-islam-2374951a9/"
                target="_blank"
              >
                <i class="fab fa-linkedin icon"></i>
              </a>
              &nbsp;
              <a href="https://angel.co/u/nazia-islam" target="_blank">
                <i class="fab fa-angellist icon"></i>
              </a>
              &nbsp;
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
