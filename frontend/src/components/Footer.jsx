const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 text-gray-600 py-4 mt-10">
      <div className="container mx-auto text-center">
        <p>MERN Shop &copy; {currentYear}</p>
      </div>
    </footer>
  );
};

export default Footer;