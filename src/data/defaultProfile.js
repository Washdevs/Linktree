import googleIcon from '../../img/goog.png';
import instagramIcon from '../../img/INSTAGRAm.png';
import locationIcon from '../../img/local.png';
import backgroundUrl from '../../img/logo1.png';
import photoUrl from '../../img/model.png';
import whatsappIcon from '../../img/WhatsaPP.png';

export const defaultIcons = {
  google: googleIcon,
  instagram: instagramIcon,
  location: locationIcon,
  whatsapp: whatsappIcon,
};

export function createDefaultProfile() {
  return {
    name: 'Superman Car Acessorios',
    handle: '@superman_car_acessorios',
    bio: 'Canais oficiais, atendimento e localizacao em um so lugar.',
    photoUrl,
    backgroundUrl,
    links: [
      {
        id: 'default-whatsapp',
        networkId: 'whatsapp',
        label: 'WhatsApp',
        url: 'https://wa.me/6291063365?text=Ola%20Gostaria%20de%20solicitar%20um%20orcamento',
      },
      {
        id: 'default-instagram',
        networkId: 'instagram',
        label: '@superman_car_acessorios',
        url: 'https://www.instagram.com/superman_car_acessorios',
      },
      {
        id: 'default-youtube',
        networkId: 'youtube',
        label: 'YouTube',
        url: 'https://youtu.be/FHh2U9DsdBA',
      },
      {
        id: 'default-maps',
        networkId: 'googleMaps',
        label: 'Localizacao',
        url: 'https://maps.app.goo.gl/pxo29v1renXfDYCd6',
      },
      {
        id: 'default-google',
        networkId: 'google',
        label: 'Perfil Google',
        url: 'https://g.co/kgs/TVtykJA',
      },
    ],
  };
}
