  import React, { useState, useEffect } from 'react';
  import '../visual/BackgroundSlideshow.css';

  // Utilisation de import pour charger les images
  import fond1 from '../../assets/fond1.jpg';
  import fond2 from '../../assets/fond2.jpg';
  import fond3 from '../../assets/fond3.jpg';
  import fond4 from '../../assets/fond4.jpg';
  import fond5 from '../../assets/fond5.jpg';
  import fond6 from '../../assets/fond6.jpg';

  const images = [fond1, fond2, fond3, fond4, fond5, fond6]; // Array des images importées

  function BackgroundSlideshow() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 15000); 

      return () => clearInterval(interval);
    }, []);

    return (
      <div
        className="background-slideshow"
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      />
    );
  }

  export default BackgroundSlideshow;