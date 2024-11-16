 
import React from "react";

// reactstrap components
import { Container, Nav, NavItem, NavLink } from "reactstrap";

function Footer() {
  return (
    <footer className="footer">
      <Container fluid>
         
        <div className="copyright">
          © {new Date().getFullYear()} made with{" "}
          <i className="tim-icons icon-heart-2" /> by{" "}
          <a
            href="https://portfoliokb-beta.vercel.app/"
            target="_blank"
          >
            khawla benchorfi 
          </a>{" "}
          for my portfolio.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
