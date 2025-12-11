import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About section */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {process.env.REACT_APP_APP_NAME || 'CodeLearn'}
            </h3>
            <p className="text-gray-400 text-sm">
              Plateforme d'apprentissage en ligne pour le développement de compétences en programmation.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/apprenant/courses" className="text-gray-400 hover:text-white text-sm">
                  Catalogue de cours
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white text-sm">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: contact@codelearn.com</li>
              <li>Support: support@codelearn.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} {process.env.REACT_APP_APP_NAME || 'CodeLearn'}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
