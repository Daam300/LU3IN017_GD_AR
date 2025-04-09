import React from 'react';
import './homepage.css';

function Homepage() {
  return (
    <div>
      <header>
        <div className="logo1">
          <img src="logo.jpg" alt="un logo bien cool" />
        </div>

        <div className="search1">
          <form>
            <input id="search" type="text" placeholder="Recherche..." />
          </form>
        </div>

        <div className="login_register">
          <a href="connexion.html">
            <button>Connexion</button>
          </a>
          <a href="Enregistement.html">
            <button>S'inscrire</button>
          </a>
        </div>
      </header>

      <main>
        <aside>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque euismod lacus sed velit fringilla ullamcorper. Cras
            leo felis, scelerisque sit amet erat et, vestibulum convallis
            ipsum. Ut iaculis tortor sed massa tristique cursus. Vestibulum vel
            dolor hendrerit nisi tristique posuere. Ut pellentesque semper
            sapien, in egestas libero cursus vitae. Morbi lobortis lacus at
            tortor tincidunt sodales. Sed a rhoncus lorem. Ut eget mauris mi.
            Aliquam dignissim vitae est vitae semper. Pellentesque sollicitudin
            porta quam, in dapibus risus aliquet fermentum. Praesent posuere
            bibendum tellus, non vestibulum metus porttitor vitae. Pellentesque
            et dictum nibh. Nam non ornare lectus. Proin congue nisl nec
            fringilla vehicula. Praesent ultricies massa at maximus fermentum.
            Aenean quam elit, consequat vitae mattis luctus, faucibus vel nunc.
            Proin et ornare ante, a porttitor ex. Mauris in eros eros.
            Suspendisse vehicula, elit non varius aliquet, nisl turpis gravida
            nunc, sed accumsan nibh lorem eu mauris. Curabitur vitae dolor
            vitae nunc luctus laoreet.
          </p>
          <p>
            Sed facilisis, sapien ac congue mollis, augue sapien pharetra
            tortor, at fermentum lacus sapien quis nisi. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Etiam ultrices augue nulla, eu
            venenatis sapien convallis at. Nullam mattis mollis neque eu
            sollicitudin. Donec ullamcorper sapien nec sem egestas, eget
            dapibus leo aliquam. Etiam interdum turpis aliquet, pulvinar mi at,
            consequat augue. Phasellus enim tortor, tincidunt id urna quis,
            volutpat gravida justo.
          </p>
          <p>
            Mauris hendrerit diam ligula, a convallis justo lacinia at. Aliquam
            et malesuada sapien, et gravida metus. Etiam sit amet porttitor
            eros. Sed eu venenatis est, sit amet rutrum felis. Mauris accumsan
            sed eros at dictum. Sed eleifend ante metus, ut gravida ex congue
            sit amet. In sed augue libero. Proin elementum ante ullamcorper
            tellus fermentum, eu blandit diam maximus. Proin in iaculis quam,
            sit amet auctor mauris. In hac habitasse platea dictumst.
            Suspendisse potenti. Cras dictum ultrices nulla, ut tempus nunc
            eleifend eu.
          </p>
        </aside>

        <div className="msg_area">
          <div className="Zone nouveau message">
            <form>
              <textarea
                name="Envoyer"
                rows="5"
                cols="30"
                placeholder="Ecrire un nouveau message..."
              ></textarea>
              <button type="submit">-&gt;</button>
            </form>
          </div>

          <div className="Liste messages">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque euismod lacus sed velit fringilla ullamcorper. Cras
              leo felis, scelerisque sit amet erat et, vestibulum convallis
              ipsum. Ut iaculis tortor sed massa tristique cursus. Vestibulum
              vel dolor hendrerit nisi tristique posuere. Ut pellentesque
              semper sapien, in egestas libero cursus vitae. Morbi lobortis
              lacus at tortor tincidunt sodales. Sed a rhoncus lorem. Ut eget
              mauris mi. Aliquam dignissim vitae est vitae semper. Pellentesque
              sollicitudin porta quam, in dapibus risus aliquet fermentum.
            </p>
            <p>29-01-2025</p>
            <p>xXx_Dark_Maxou69_xXx</p>
            <a href="reply.html">
              <button>+</button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Homepage;