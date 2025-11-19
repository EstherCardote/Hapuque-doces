// Carrossel de galeria com controles manuais
const track = document.querySelector('.carrossel-galeria-track');
const slides = document.querySelectorAll('.carrossel-galeria-slide');
const btnPrev = document.querySelector('.carrossel-btn-prev');
const btnNext = document.querySelector('.carrossel-btn-next');
const indicators = document.querySelectorAll('.indicator');

let indiceAtual = 0;
let slidesVisiveis = getSlidesVisiveis();
const totalSlides = slides.length;
let autoplayInterval;

// Determina quantos slides mostrar baseado no tamanho da tela
function getSlidesVisiveis() {
  const width = window.innerWidth;
  if (width < 768) return 1;      // Mobile: 1 slide
  if (width < 1024) return 2;     // Tablet: 2 slides
  return 3;                        // Desktop: 3 slides
}

// Calcula o máximo de slides que podem ser mostrados
function getMaxSlide() {
  return Math.max(0, totalSlides - slidesVisiveis);
}

// Move o carrossel para o índice especificado
function moverCarrossel(novoIndice) {
  const maxSlide = getMaxSlide();
  
  // Garante que o índice está dentro dos limites
  if (novoIndice < 0) {
    indiceAtual = 0;
  } else if (novoIndice > maxSlide) {
    indiceAtual = maxSlide;
  } else {
    indiceAtual = novoIndice;
  }
  
  // Calcula o deslocamento baseado no número de slides visíveis
  const slideWidth = 100 / slidesVisiveis;
  const deslocamento = -indiceAtual * slideWidth;
  
  track.style.transform = `translateX(${deslocamento}%)`;
  
  // Atualiza indicadores
  atualizarIndicadores();
  
  // Atualiza estado dos botões
  atualizarBotoes();
}

// Atualiza os indicadores visuais
function atualizarIndicadores() {
  indicators.forEach((indicator, index) => {
    indicator.classList.remove('active');
    if (index === indiceAtual) {
      indicator.classList.add('active');
    }
  });
}

// Atualiza o estado dos botões (desabilita quando chega no limite)
function atualizarBotoes() {
  const maxSlide = getMaxSlide();
  
  btnPrev.disabled = indiceAtual === 0;
  btnNext.disabled = indiceAtual >= maxSlide;
  
  btnPrev.style.opacity = indiceAtual === 0 ? '0.3' : '1';
  btnNext.style.opacity = indiceAtual >= maxSlide ? '0.3' : '1';
}

// Navega para o slide anterior
function slideAnterior() {
  moverCarrossel(indiceAtual - 1);
  reiniciarAutoplay();
}

// Navega para o próximo slide
function slideProximo() {
  moverCarrossel(indiceAtual + 1);
  reiniciarAutoplay();
}

// Autoplay - avança automaticamente
function iniciarAutoplay() {
  autoplayInterval = setInterval(() => {
    const maxSlide = getMaxSlide();
    if (indiceAtual >= maxSlide) {
      moverCarrossel(0); // Volta para o início
    } else {
      slideProximo();
    }
  }, 5000); // Muda a cada 5 segundos
}

// Reinicia o autoplay
function reiniciarAutoplay() {
  clearInterval(autoplayInterval);
  iniciarAutoplay();
}

// Para o autoplay
function pararAutoplay() {
  clearInterval(autoplayInterval);
}

// Event listeners para os botões
btnPrev.addEventListener('click', slideAnterior);
btnNext.addEventListener('click', slideProximo);

// Event listeners para os indicadores
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    moverCarrossel(index);
    reiniciarAutoplay();
  });
});

// Para o autoplay quando o mouse está sobre o carrossel
const container = document.querySelector('.carrossel-galeria-container');
container.addEventListener('mouseenter', pararAutoplay);
container.addEventListener('mouseleave', iniciarAutoplay);

// Suporte para navegação por teclado (acessibilidade)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    slideAnterior();
  } else if (e.key === 'ArrowRight') {
    slideProximo();
  }
});

// Suporte para gestos de swipe em mobile
let touchStartX = 0;
let touchEndX = 0;

container.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  pararAutoplay();
});

container.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
  iniciarAutoplay();
});

function handleSwipe() {
  const swipeThreshold = 50; // Distância mínima para detectar swipe
  
  if (touchEndX < touchStartX - swipeThreshold) {
    // Swipe para esquerda - próximo slide
    slideProximo();
  }
  
  if (touchEndX > touchStartX + swipeThreshold) {
    // Swipe para direita - slide anterior
    slideAnterior();
  }
}

// Recalcula slides visíveis ao redimensionar a janela
window.addEventListener('resize', () => {
  const novoSlidesVisiveis = getSlidesVisiveis();
  
  if (novoSlidesVisiveis !== slidesVisiveis) {
    slidesVisiveis = novoSlidesVisiveis;
    moverCarrossel(0); // Volta para o início ao mudar layout
  }
});

// Inicializa o carrossel
moverCarrossel(0);
iniciarAutoplay();
