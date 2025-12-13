// src/components/Footer.jsx
const Footer = () => {
  return (
    <div className="bg-base-200">

      <footer className=" footer  text-base-content mt-16">
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Contact Details */}
          <div>
            <h2 className="footer-title">Contact Us</h2>
            <p>Email: support@yourbusiness.com</p>
            <p>Phone: +880 1234-567890</p>
            <p>Address: Dhaka, Bangladesh</p>
          </div>

          {/* Social Media Links */}
          <div>
            <h2 className="footer-title">Social Links</h2>
            <ul className="space-y-2">
              <li><a className="link link-hover" href="#">Facebook</a></li>
              <li><a className="link link-hover" href="#">Instagram</a></li>
              <li><a className="link link-hover" href="#">Twitter</a></li>
              <li><a className="link link-hover" href="#">YouTube</a></li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h2 className="footer-title">Business Hours</h2>
            <p>Mon–Fri: 9:00 AM – 8:00 PM</p>
            <p>Saturday: 10:00 AM – 6:00 PM</p>
            <p>Sunday: Closed</p>
          </div>

          {/* Extra Info */}
          <div>
            <h2 className="footer-title">About Us</h2>
            <p>
              We provide the best decoration and event management services
              tailored to your needs. Customer satisfaction is our priority.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}

      </footer>
      <div className="bg-base-300 py-4 text-center text-sm">
        © {new Date().getFullYear()} Your Business Name — All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
