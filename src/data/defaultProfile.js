export function createDefaultProfile() {
  return {
    name: 'Seu Nome Criativo',
    handle: '@seuperfil',
    bio: 'Conteudos, redes, comunidade e projetos em um unico lugar.',
    photoUrl: '',
    backgroundUrl: '',
    links: [
      {
        id: 'default-instagram',
        networkId: 'instagram',
        label: '@seuperfil',
        url: 'https://www.instagram.com/seuperfil',
      },
      {
        id: 'default-tiktok',
        networkId: 'tiktok',
        label: '@seuperfil',
        url: 'https://www.tiktok.com/@seuperfil',
      },
      {
        id: 'default-youtube',
        networkId: 'youtube',
        label: 'YouTube',
        url: 'https://www.youtube.com/@seuperfil',
      },
      {
        id: 'default-whatsapp',
        networkId: 'whatsapp',
        label: 'WhatsApp',
        url: 'https://wa.me/5500000000000',
      },
    ],
  };
}
