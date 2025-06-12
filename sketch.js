let riceSeeds = []; // Array para armazenar as posições das sementes

// --- VARIÁVEIS PARA O CAMINHÃO E TEMPO ---
let startTime; // Para armazenar o tempo de início do sketch
const DELAY_TIME = 10000; // 10 segundos em milissegundos
let showTruck = false; // Controle para exibir o caminhão

let truckX; // Posição X atual do caminhão
const TRUCK_SPEED = 2; // Velocidade do caminhão (pixels por quadro)
const TRUCK_WIDTH = 150; // Largura aproximada do caminhão (corpo + cabine)
const TRUCK_Y_BASE = 290; // Y base do caminhão (height / 2 + 50)
// ---------------------------------------------

// --- NOVAS VARIÁVEIS DE ESTADO PARA O CENÁRIO ---
let currentScene = 0; // 0 para o campo, 1 para a cidade, 2 para a feira, 3 para o final
let showInstructions = true; // NOVO: Controla a visibilidade das instruções na cena 0
// -------------------------------------------------

// --- VARIÁVEIS PARA O BONECO PRINCIPAL (AZUL) ---
let showCharacter = false; // Controle para exibir o boneco
let characterX; // Posição X atual do boneco
let characterY; // Posição Y atual do boneco
const CHARACTER_SPEED = 1.5; // Velocidade de descida/movimento do boneco
const CHARACTER_START_Y_OFFSET = -30; // Offset Y inicial do boneco em relação ao caminhão
const CHARACTER_GROUND_Y_OFFSET = 20; // Offset Y final do boneco em relação à base da estrada
let truckStoppedTime = 0; // Para registrar quando o caminhão parou
const CHARACTER_DELAY = 1000; // Atraso para o boneco começar a descer (1 segundo)
let characterState = 0; // 0: Descendo, 1: Parado, 2: Indo para o caminhão, 3: Coletando sacolas, 4: Andando com sacolas, 5: Parado na feira
const CHARACTER_TO_TRUCK_X_OFFSET = 30; // Distância que o azul vai andar do verde até o caminhão (não usada diretamente com targetTruckX)
const CHARACTER_COLLECT_DURATION = 3500; // Tempo que leva para coletar as sacolas (3.5 segundos)
let characterCollectTime = 0; // Tempo em que o azul começou a coletar
let showSacks = false; // Controla a exibição das sacolas

// --- VARIÁVEIS PARA A FALA DO BONECO PRINCIPAL (AZUL) ---
let showCharacterSpeech = false; // Controla se o balão de fala está visível
let speechDisplayTime = 0; // Armazena o momento em que a fala começou
const SPEECH_DURATION = 3500; // Duração da fala em milissegundos
// ---------------------------------------------

// --- NOVAS VARIÁVEIS PARA O SEGUNDO BONECO (VERDE) E FALAS ---
let showSecondCharacter = false; // Controle para exibir o segundo boneco
let secondCharacterX; // Posição X atual do segundo boneco
let secondCharacterY; // Posição Y atual do segundo boneco

let showSecondCharacterSpeech = false; // Controla se o balão de fala do segundo boneco está visível (1ª fala)
let secondSpeechDisplayTime = 0; // Armazena o momento em que a 1ª fala do segundo boneco começou
const SECOND_SPEECH_DURATION = 3500; // Duração da primeira fala do segundo boneco (3.5 segundos)

let showSecondCharacterSpeech2 = false; // Controla a segunda fala do boneco verde
let secondSpeechDisplayTime2 = 0; // Tempo de início da segunda fala
const SECOND_SPEECH_DURATION2 = 2000; // Duração da segunda fala (2 segundos)
const SECOND_SPEECH_DELAY2 = 500; // Atraso entre a primeira e a segunda fala do verde (0.5 segundos)
const SECOND_CHARACTER_DELAY = 1500; // Atraso para o segundo boneco e sua primeira fala aparecerem após o primeiro (1.5 segundos)

// NOVAS VARIÁVEIS PARA AS FALAS DO VERDE NA FEIRA
let showGreenSpeechFair1 = false;
let greenSpeechFairTime1 = 0;
const GREEN_SPEECH_FAIR_DURATION1 = 4000; // 4 segundos

let showGreenSpeechFair2 = false;
let greenSpeechFairTime2 = 0;
const GREEN_SPEECH_FAIR_DURATION2 = 4000; // 4 segundos
const GREEN_SPEECH_FAIR_DELAY2 = 500; // 0.5 segundos de atraso entre as falas na feira
// ----------------------------------------------------

// Variável para controlar a exibição das bolinhas de milho na barraca
let showCornInStall = false;

// --- NOVAS VARIÁVEIS PARA O ATRASO DA CENA FINAL ---
let finalSceneTransitionTime = 0; // Para registrar quando o atraso para a cena final começou
const FINAL_SCENE_DELAY = 3000; // 3 segundos de atraso antes de mudar para a cena final


function setup() {
  createCanvas(600, 600);

  // Captura o tempo atual assim que o sketch começa
  startTime = millis();

  // Define a posição inicial do caminhão fora da tela, à ESQUERDA
  truckX = -200;
  // Define a posição inicial do boneco (será ajustada dinamicamente)
  characterX = truckX + TRUCK_WIDTH - 20; // Perto da porta da cabine
  characterY = TRUCK_Y_BASE + CHARACTER_START_Y_OFFSET;

  // Define uma posição inicial para o segundo boneco (apenas para inicialização)
  secondCharacterX = 0;
  secondCharacterY = 0;
}

function draw() {
  // --- Lógica de Desenho dos Cenários ---
  if (currentScene === 0) {
    drawScene0(); // Desenha o cenário do campo

    if (mouseIsPressed && mouseY > height / 2) {
      riceSeeds.push({ x: mouseX, y: mouseY });
    }
    for (let i = 0; i < riceSeeds.length; i++) {
      plantRiceSeeds(riceSeeds[i].x, riceSeeds[i].y);
    }

    // Lógica do caminhão no cenário do campo (continua se movendo e coletando)
    if (millis() - startTime >= DELAY_TIME) {
      showTruck = true;
    }

    if (showTruck) {
      truckX += TRUCK_SPEED;

      if (truckX > width + 200) {
        truckX = -200;
      }
      drawTruck(truckX, TRUCK_Y_BASE);

      // Lógica de Coleta de Sementes
      const TRUCK_COLLECT_ZONE_HEIGHT = 40;
      const SEED_SIZE = 10;

      for (let i = riceSeeds.length - 1; i >= 0; i--) {
        let seed = riceSeeds[i];
        if (seed.x > truckX &&
          seed.x < truckX + TRUCK_WIDTH &&
          seed.y + SEED_SIZE / 2 > TRUCK_Y_BASE &&
          seed.y - SEED_SIZE / 2 < TRUCK_Y_BASE + TRUCK_COLLECT_ZONE_HEIGHT) {
          riceSeeds.splice(i, 1);
        }
      }
    }

  } else if (currentScene === 1) { // Se estiver no cenário da cidade
    drawScene1(); // Desenha o cenário da cidade

    // Caminhão se move até o meio da tela e para
    let targetTruckX = (width / 2) - (TRUCK_WIDTH / 2);
    if (truckX < targetTruckX) {
      truckX += TRUCK_SPEED;
      truckStoppedTime = 0; // Reinicia o tempo de parada se estiver em movimento
    } else {
      truckX = targetTruckX; // Caminhão chegou no meio
      if (truckStoppedTime === 0) {
        truckStoppedTime = millis();
      }
      if (millis() - truckStoppedTime >= CHARACTER_DELAY) {
        showCharacter = true;
      }
    }
    drawTruck(truckX, TRUCK_Y_BASE); // Desenha o caminhão

    // --- Lógica do Boneco Principal (Azul) na Cidade ---
    if (showCharacter) {
      const groundY = TRUCK_Y_BASE + CHARACTER_GROUND_Y_OFFSET;
      const truckDoorX = truckX + TRUCK_WIDTH - 20; // Posição da porta da cabine

      // Estado 0: Descendo do caminhão
      if (characterState === 0) {
        if (characterY < groundY) {
          characterY += CHARACTER_SPEED;
        } else {
          characterY = groundY;
          characterState = 1; // Boneco parado no chão
          // Ativa a fala do boneco principal
          if (!showCharacterSpeech && !showSecondCharacter) {
            showCharacterSpeech = true;
            speechDisplayTime = millis();
          }
        }
      }
      // Estado 1: Parado no chão (conversando e esperando comando do verde)
      else if (characterState === 1) {
        // A fala do boneco azul já é controlada acima e no drawSpeechBubble

        // Ativa o segundo boneco e sua primeira fala
        if (!showSecondCharacter && (millis() - speechDisplayTime >= SECOND_CHARACTER_DELAY)) {
          showSecondCharacter = true;
          secondCharacterX = characterX + 60; // Posiciona o verde à direita do azul
          secondCharacterY = groundY;
          showSecondCharacterSpeech = true; // Ativa a primeira fala do verde
          secondSpeechDisplayTime = millis();
          showCharacterSpeech = false; // Desativa a fala do boneco azul
        }
        // Ativa a segunda fala do verde após a primeira
        if (showSecondCharacter && !showSecondCharacterSpeech && !showSecondCharacterSpeech2 && (millis() - secondSpeechDisplayTime >= SECOND_SPEECH_DURATION + SECOND_SPEECH_DELAY2)) {
          showSecondCharacterSpeech2 = true;
          secondSpeechDisplayTime2 = millis();
        }
        // Transição para pegar sacolas APENAS APÓS a segunda fala do verde SUMIR
        if (showSecondCharacter && !showSecondCharacterSpeech && !showSecondCharacterSpeech2) { // se o segundo boneco está visível e AMBAS as falas dele terminaram
          characterState = 2; // Inicia movimento para pegar sacolas
        }
      }
      // Estado 2: Indo para o caminhão pegar sacolas
      else if (characterState === 2) {
        let targetCollectX = truckX + (TRUCK_WIDTH / 2); // Meio do caminhão
        if (characterX > targetCollectX) {
          characterX -= CHARACTER_SPEED; // Anda para a esquerda
        } else {
          characterX = targetCollectX;
          // Agora, a sacola aparece assim que ele chega ao caminhão
          showSacks = true;
          characterCollectTime = millis(); // Marca o início da coleta
          characterState = 3; // Estado de coleta
        }
      }
      // Estado 3: Coletando sacolas (simulação)
      else if (characterState === 3) {
        if (millis() - characterCollectTime >= CHARACTER_COLLECT_DURATION) {
          characterState = 4; // Terminou de coletar, agora vai andar com o verde
        }
      }
      // Estado 4: Andando junto com o boneco verde para fora da tela (ou para o centro na feira)
      else if (characterState === 4) {
        let targetEndScreenX = width + 50; // Para onde eles vão sair da tela
        if (characterX < targetEndScreenX) { // Se ainda estão se movendo na tela
          characterX += CHARACTER_SPEED;
          secondCharacterX += CHARACTER_SPEED; // O verde anda junto!
        } else {
          // Ambos saíram da tela, troca para o próximo cenário
          currentScene = 2; // Cena da feira
          // Reset para o próximo cenário
          resetSceneElements();
        }
      }

      drawCharacter(characterX, characterY, showSacks); // Desenha o boneco azul (com ou sem sacolas)

      // Desenha a fala do primeiro boneco (azul)
      if (showCharacterSpeech) {
        if (millis() - speechDisplayTime < SPEECH_DURATION) {
          drawSpeechBubble(characterX, characterY, 180, 50, "Olá! Trouxe o milho", "fresquinho do campo!", false); // false = ponta para a direita
        } else {
          showCharacterSpeech = false;
        }
      }
    }

    // --- Lógica e desenho do Segundo Boneco (Verde) na Cidade ---
    if (showSecondCharacter) {
      drawSecondCharacter(secondCharacterX, secondCharacterY);

      // Primeira fala do boneco verde
      if (showSecondCharacterSpeech) {
        if (millis() - secondSpeechDisplayTime < SECOND_SPEECH_DURATION) {
          drawSpeechBubble(secondCharacterX, secondCharacterY, 140, 50, "Que ótimo! As pessoas", "da cidade agradecem!", true); // true = ponta para a esquerda
        } else {
          showSecondCharacterSpeech = false; // Esconde a primeira fala
        }
      }

      // Segunda fala do boneco verde ("Me siga!")
      if (showSecondCharacterSpeech2) {
        if (millis() - secondSpeechDisplayTime2 < SECOND_SPEECH_DURATION2) {
          drawSpeechBubble(secondCharacterX, secondCharacterY, 80, 30, "Me siga!", "", true); // true = ponta para a esquerda
        } else {
          showSecondCharacterSpeech2 = false; // Esconde a segunda fala após o tempo
        }
      }
    }
  } else if (currentScene === 2) {
    drawScene2(); // Desenha o cenário da feira

    // --- Lógica de movimento e parada dos personagens na Feira ---
    // A barraca de milho está na posição X = 410
    let targetStallX = 410 + 30; // Posiciona Tião na frente da barraca (410 + um offset)
    let targetSecondStallX = targetStallX + 40; // Amigo um pouco ao lado

    // Se eles ainda não chegaram perto da barraca de milho
    if (characterX < targetStallX || secondCharacterX < targetSecondStallX) {
      characterX += CHARACTER_SPEED;
      secondCharacterX += CHARACTER_SPEED;
      characterState = 4; // Mantém estado de andando
    } else {
      characterX = targetStallX;
      secondCharacterX = targetSecondStallX;
      characterState = 5; // Estado de parado na feira
      showSacks = false; // Tião já "entregou" as sacolas de arroz
      showCornInStall = true; // Mostra o milho na barraca!

      // --- Lógica das falas do verde na feira ---
      if (characterState === 5) { // Só mostra as falas quando os personagens estão parados
        if (!showGreenSpeechFair1 && !showGreenSpeechFair2) { // Inicia a primeira fala se nenhuma estiver visível
          showGreenSpeechFair1 = true;
          greenSpeechFairTime1 = millis();
        }

        // Verifica se a primeira fala terminou para potencialmente iniciar a segunda
        if (showGreenSpeechFair1 && millis() - greenSpeechFairTime1 >= GREEN_SPEECH_FAIR_DURATION1) {
          showGreenSpeechFair1 = false; // Esconde a primeira fala
          // Agora, se a segunda fala ainda não começou, aciona-a após um atraso
          if (!showGreenSpeechFair2 && (millis() - greenSpeechFairTime1 - GREEN_SPEECH_FAIR_DURATION1 >= GREEN_SPEECH_FAIR_DELAY2)) {
            showGreenSpeechFair2 = true;
            greenSpeechFairTime2 = millis();
          }
        }
        // Lógica para acionar a NOVA cena final APÓS a segunda fala do verde ter terminado
        // E após um atraso adicional.
        if (!showGreenSpeechFair1 && !showGreenSpeechFair2) { // As falas terminaram
          // Se o tempo para o atraso final ainda não foi registrado, registre-o
          if (finalSceneTransitionTime === 0) {
            finalSceneTransitionTime = millis();
          }

          // Se o tempo de atraso já passou, mude para a cena final
          if (millis() - finalSceneTransitionTime >= FINAL_SCENE_DELAY) {
            currentScene = 3; // Muda para a nova cena final
            // Esconde os bonecos antes da cena mudar para o cenário final
            showCharacter = false; // Esconde Tião
            showSecondCharacter = false; // Esconde o amigo
            resetSceneElements(); // Reseta os elementos para a cena 3 (vai garantir que permaneçam escondidos)
          }
        }
      }
    }

    // Desenha os personagens na feira
    if (showCharacter && showSecondCharacter) { // Desenha se eles estão ativos
      drawCharacter(characterX, characterY, showSacks);
      drawSecondCharacter(secondCharacterX, secondCharacterY);

      // Desenha as falas do verde na feira
      if (showGreenSpeechFair1) {
        if (millis() - greenSpeechFairTime1 < GREEN_SPEECH_FAIR_DURATION1) {
          drawSpeechBubble(secondCharacterX, secondCharacterY, 150, 50, "Muito obrigado, Tião!", "Seu esforço valeu a pena!", true);
        } else {
          showGreenSpeechFair1 = false; // Garante que esteja escondido após sua duração
        }
      }
      if (showGreenSpeechFair2) {
        if (millis() - greenSpeechFairTime2 < GREEN_SPEECH_FAIR_DURATION2) {
          drawSpeechBubble(secondCharacterX, secondCharacterY, 170, 50, "Fique conosco", "para comemorar!", true);
        } else {
          showGreenSpeechFair2 = false; // Garante que esteja escondido após sua duração
        }
      }
    }
  } else if (currentScene === 3) { // NOVO CENÁRIO FINAL!
    drawScene3();
  }
}

// --- Nova função auxiliar para desenhar balões de fala ---
function drawSpeechBubble(x, y, w, h, line1, line2, pointLeft) {
  push();
  fill(255); // Cor do balão de fala (branco)
  let balloonX;
  if (pointLeft) { // Se a ponta deve ir para a esquerda (para o boneco verde)
    balloonX = x - 10 - w;
  } else { // Se a ponta deve ir para a direita (para o boneco azul)
    balloonX = x + 15;
  }
  let balloonY = y - 70;
  let borderRadius = 8;

  rect(balloonX, balloonY, w, h, borderRadius);

  // Ponta do balão (triângulo)
  noStroke();
  if (pointLeft) {
    triangle(
      balloonX + w, balloonY + h - 10,
      balloonX + w, balloonY + h,
      x + 5, y + 40
    );
  } else {
    triangle(
      balloonX, balloonY + h - 10,
      balloonX, balloonY + h,
      x + 5, y + 40
    );
  }
  stroke(0);
  strokeWeight(1);

  fill(0); // Cor do texto (preto)
  textSize(14);
  textAlign(CENTER, CENTER);
  text(line1, balloonX + (w / 2), balloonY + (h / 2) - (line2 ? 10 : 0));
  if (line2) {
    text(line2, balloonX + (w / 2), balloonY + (h / 2) + 10);
  }
  textAlign(LEFT, BASELINE);
  pop();
}

function drawScene0() {
  background('rgb(45, 45, 172)'); // Céu

  // Apenas desenha as instruções se showInstructions for true
  if (showInstructions) {
    fill(0);
    textSize(16);
    text("Pressione o mouse para plantar as sementes somente na área marrom.", 50, 50);
    textSize(15);
    text("Clique na tecla N para trocar de cenário após a colheita das sementes.", 90, 90);
  }

  fill(24, 120, 24); // verde escuro
  noStroke();
  rect(0, height / 2, width, height / 2);

  fill('rgb(165,39,39)'); // Cor marrom
  rect(0, height / 2 - 6, width, 60);

  drawTree(20, height / 2 - 40);
  drawTree(80, height / 2 - 40);
  drawTree(140, height / 2 - 40);
}

function drawScene1() {
  background(100, 150, 200); // Céu mais claro para o dia na cidade

  fill(80, 80, 80); // Cor de asfalto
  rect(0, height / 2 + 40, width, height / 2 - 40);

  stroke(255, 255, 0); // Amarelo
  strokeWeight(5);
  line(4, height / 2 + 140, width, height / 2 + 140);
  noStroke();

  // Prédios (sem mudanças, conforme seu código original)
  fill(120, 120, 120); rect(50, height / 2 - 50, 80, 90); fill(200, 200, 0); rect(60, height / 2 - 40, 10, 15); rect(60, height / 2 - 20, 10, 15); rect(80, height / 2 - 40, 10, 15); rect(80, height / 2 - 20, 10, 15);
  fill(120, 120, 120); rect(150, height / 2 - 100, 70, 140); fill(200, 200, 0); rect(160, height / 2 - 90, 10, 15); rect(180, height / 2 - 90, 10, 15); rect(160, height / 2 - 70, 10, 15); rect(180, height / 2 - 70, 10, 15); rect(160, height / 2 - 50, 10, 15); rect(180, height / 2 - 50, 10, 15);
  fill(120, 120, 120); rect(250, height / 2 - 30, 60, 70); fill(200, 200, 0); rect(260, height / 2 - 20, 10, 15); rect(280, height / 2 - 20, 10, 15); rect(260, height / 2, 10, 15); rect(280, height / 2, 10, 15);
  fill(120, 120, 120); rect(350, height / 2 - 80, 90, 120); fill(200, 200, 0); rect(360, height / 2 - 70, 10, 15); rect(380, height / 2 - 70, 10, 15); rect(400, height / 2 - 70, 10, 15); rect(360, height / 2 - 50, 10, 15); rect(380, height / 2 - 50, 10, 15); rect(400, height / 2 - 50, 10, 15); rect(360, height / 2 - 30, 10, 15); rect(380, height / 2 - 30, 10, 15); rect(400, height / 2 - 30, 10, 15);
  fill(120, 120, 120); rect(480, height / 2 - 60, 75, 100); fill(200, 200, 0); rect(490, height / 2 - 50, 10, 15); rect(510, height / 2 - 50, 10, 15); rect(530, height / 2 - 50, 10, 15); rect(490, height / 2 - 30, 10, 15); rect(510, height / 2 - 30, 10, 15); rect(530, height / 2 - 30, 10, 15);

  fill(0);
  textSize(20);
  textAlign(CENTER, TOP);
  text("Bem-vindo à Cidade!", width / 2, 50);
  textAlign(LEFT, BASELINE);
}

// --- Funções para desenhar elementos da feira (mais modulares) ---

// Função para desenhar uma barraca
function drawStall(x, y, stallWidth, stallHeight, awningColor, contentText, showProduct = false, productType = null) {
  push();
  translate(x, y);

  // Balcão de madeira
  fill(139, 69, 19); // Marrom escuro para madeira
  rect(0, 0, stallWidth, stallHeight, 5); // Base arredondada

  // Poste de apoio (vertical)
  fill(100); // Cinza escuro
  rect(5, -stallHeight - 10, 5, stallHeight + 10);
  rect(stallWidth - 10, -stallHeight - 10, 5, stallHeight + 10);


  // Toldo
  fill(awningColor);
  let awningHeight = 50;
  rect(-10, -awningHeight, stallWidth + 20, awningHeight + 10, 5); // Base do toldo
  // Faixas do toldo
  stroke(0);
  strokeWeight(1);
  line(-10, -awningHeight + 10, stallWidth + 10, -awningHeight + 10);
  line(-10, -awningHeight + 20, stallWidth + 10, -awningHeight + 20);
  noStroke();

  // "Contorno" do toldo para efeito 3D
  fill(red(awningColor) * 0.8, green(awningColor) * 0.8, blue(awningColor) * 0.8);
  rect(-10, -awningHeight, 5, awningHeight + 10, 5); // Lado esquerdo
  rect(stallWidth + 5, -awningHeight, 5, awningHeight + 10, 5); // Lado direito

  // Texto do que vende
  fill(255); // Branco para o texto
  textSize(16);
  textAlign(CENTER, CENTER);
  text(contentText, stallWidth / 2, -awningHeight / 2);

  // Exemplo de produto
  if (showProduct) {
    if (productType === "fruta") {
      fill(255, 100, 0); // Cor de fruta (laranja)
      ellipse(stallWidth / 2 - 15, stallHeight - 15, 20, 20); // Fruta 1
      ellipse(stallWidth / 2 + 15, stallHeight - 10, 20, 20); // Fruta 2
    } else if (productType === "artesanato") {
      fill(150, 50, 200); // Cor de artesanato (roxo)
      rect(stallWidth / 2 - 15, stallHeight - 15, 20, 20); // Objeto 1
      triangle(stallWidth / 2 + 5, stallHeight - 15, stallWidth / 2 + 25, stallHeight - 15, stallWidth / 2 + 15, stallHeight - 35); // Objeto 2
    } else if (productType === "milho") {
      // Desenha duas espigas de milho!
      drawCorn(stallWidth / 2 - 25, stallHeight - 20); // Primeira espiga
      drawCorn(stallWidth / 2 + 25, stallHeight - 30); // Segunda espiga (Moved up by 10 pixels to avoid overlap!)
    }
  }

  pop();
}

// --- Nova função para desenhar uma espiga de milho ---
function drawCorn(x, y) {
  push();
  translate(x, y);

  // Corpo do milho
  fill(255, 200, 0); // Amarelo milho
  ellipse(0, 0, 20, 50); // Formato alongado do milho

  // Palha (verde claro)
  fill(120, 200, 80);
  beginShape();
  vertex(-10, -25);
  vertex(-15, -10);
  vertex(-10, 25);
  vertex(-5, 25);
  endShape(CLOSE);

  beginShape();
  vertex(10, -25);
  vertex(15, -10);
  vertex(10, 25);
  vertex(5, 25);
  endShape(CLOSE);

  pop();
}


// --- Nova função para o cenário da feira ---
function drawScene2() {
  background(173, 216, 230); // Céu azul claro para o dia da feira

  // Asfalto/Chão da Feira
  fill(80, 80, 80);
  rect(0, height / 2 + 40, width, height / 2 - 40);

  // Calçada
  fill(180, 180, 180);
  rect(0, height / 2 + 20, width, 20);

  // Faixas na rua
  stroke(255, 255, 0); // Amarelo
  strokeWeight(5);
  line(4, height / 2 + 100, width, height / 2 + 100);

  noStroke(); // Remove a borda para os próximos desenhos

  // --- Barracas da Feira (melhoradas!) ---
  drawStall(70, height / 2 + 20, 120, 50, color(255, 120, 120), "FRUTAS FRESCAS", true, "fruta"); // Barraca de frutas
  drawStall(240, height / 2 + 20, 120, 50, color(120, 255, 120), "ARTESANATO", true, "artesanato"); // Barraca de artesanato
  drawStall(410, height / 2 + 20, 120, 50, color(120, 120, 255), "MILHO DO CAMPO", showCornInStall, "milho"); // Barraca de milho (controlada por showCornInStall)


  // --- Pessoas na Feira (Bonecos simples) ---
  drawSimplePerson(width * 0.2, height / 2 + 120, 0, 150, 0); // Verde escuro
  drawSimplePerson(width * 0.4, height / 2 + 100, 200, 50, 200); // Roxo
  drawSimplePerson(width * 0.6, height / 2 + 130, 200, 200, 0); // Amarelo
  drawSimplePerson(width * 0.8, height / 2 + 110, 50, 50, 50); // Cinza

  // Título da Feira
  fill(0);
  textSize(28);
  textAlign(CENTER, TOP);
  text("Feira da Colheita de Irati!", width / 2, 50);
  textSize(16);
  text("Onde o campo e a cidade se encontram!", width / 2, 85);
  textAlign(LEFT, BASELINE);
}

// --- Nova função auxiliar para desenhar pessoas simples ---
function drawSimplePerson(x, y, r, g, b) {
  push();
  translate(x, y);

  // Cabeça
  fill(255, 220, 180); // Cor de pele
  ellipse(0, 0, 15, 15);

  // Cabelo simples
  fill(50, 50, 0); // Marrom
  arc(0, -5, 18, 10, PI, TWO_PI);


  // Corpo
  fill(r, g, b); // Cor da roupa
  rect(-8, 8, 16, 25);

  // Pernas
  fill(0); // Preto
  rect(-6, 33, 5, 15);
  rect(1, 33, 5, 15);

  pop();
}


function drawTruck(x, y) {
  push();
  noFill();
  stroke(255, 0, 0);
  strokeWeight(2);
  const TRUCK_COLLECT_ZONE_HEIGHT = 40;
  rect(x, y, TRUCK_WIDTH, TRUCK_COLLECT_ZONE_HEIGHT);
  pop(); // Restaura as configurações de estilo anteriores

  // Corpo principal do caminhão
  fill(150, 0, 0);
  noStroke();
  rect(x, y, 100, 40);

  // Cabine do caminhão
  fill(200, 0, 0);
  rect(x + 100, y - 20, 50, 40);

  // Janela da cabine
  fill(200, 200, 255);
  rect(x + 110, y - 10, 30, 15);

  // Rodas
  fill(50);
  ellipse(x + 25, y + 40, 25, 25);
  ellipse(x + 95, y + 40, 25, 25);
}

function drawTree(x, y) {
  fill(139, 69, 19);
  rect(x - 10, y, 20, 40);

  fill(34, 139, 34);
  ellipse(x, y - 20, 60, 60);
}

function plantRiceSeeds(x, y) {
  fill('rgb(238,224,224)');
  ellipse(x, y, 10, 10);
}

// O parâmetro 'hasSacks' controla se as sacolas são desenhadas
function drawCharacter(x, y, hasSacks = false) {
  push();
  translate(x, y); // Move a origem para a posição do boneco

  // Cabeça
  fill(255, 220, 180); // Cor de pele
  ellipse(0, 0, 20, 20); // Cabeça

  // Corpo
  fill(0, 0, 200); // Azul
  rect(-10, 10, 20, 30); // Corpo

  // Pernas
  fill(0); // Preto
  rect(-8, 40, 6, 20); // Perna esquerda
  rect(2, 40, 6, 20); // Perna direita

  // Braços
  rect(-15, 10, 5, 25); // Braço esquerdo
  rect(10, 10, 5, 25); // Braço direito

  // Desenha as sacolas se 'hasSacks' for true
  if (hasSacks) {
    fill(180, 180, 180, 200); // Cinza claro com transparência para a sacola
    ellipse(-8, 28, 15, 20); // Sacola esquerda
    ellipse(8, 28, 15, 20); // Sacola direita
    fill(0); // Cor do texto
    textSize(8);
    textAlign(CENTER, CENTER);
    text("MILHO", 0, 28); // Texto nas sacolas
  }

  pop();
}

function drawSecondCharacter(x, y) {
  push();
  translate(x, y); // Move a origem para a posição do segundo boneco

  // Cabeça (cor diferente)
  fill(180, 150, 100); // Cor de pele um pouco mais escura
  ellipse(0, 0, 20, 20);

  // Cabelo
  fill(50, 50, 0); // Marrom escuro
  arc(0, -5, 25, 15, PI, TWO_PI); // Forma simples de cabelo

  // Corpo (cor diferente)
  fill(0, 150, 0); // Verde
  rect(-10, 10, 20, 30);

  // Pernas
  fill(0); // Preto
  rect(-8, 40, 6, 20); // Perna esquerda
  rect(2, 40, 6, 20); // Perna direita

  // Braços
  rect(-15, 10, 5, 25); // Braço esquerdo
  rect(10, 10, 5, 25); // Braço direito

  pop();
}

// --- NOVA FUNÇÃO PARA O CENA FINAL ---
function drawScene3() {
  background(20, 20, 80); // Azul escuro para o céu noturno

  // Chão
  fill(50, 50, 50); // Cinza escuro para o chão
  rect(0, height * 0.7, width, height * 0.3);

  // Estrelas (pontos simples aleatórios)
  fill(255); // Branco
  for (let i = 0; i < 50; i++) {
    ellipse(random(width), random(height * 0.6), random(1, 3), random(1, 3));
  }

  // Grande texto "Obrigado por jogar!"
  push();
  fill(255, 255, 0); // Amarelo para texto de destaque
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Obrigado por jogar!", width / 2, height / 3);
  textSize(24);
  fill(200, 200, 255); // Azul claro para o subtítulo
  text("Até a próxima colheita!", width / 2, height / 3 + 40);
  pop();

  // Os bonecos NÃO serão desenhados aqui porque showCharacter e showSecondCharacter serão false.

  // Mensagem para retornar ao início
  fill(255);
  textSize(16);
  textAlign(CENTER, BOTTOM);
  text("Pressione 'N' para recomeçar", width / 2, height - 20);
}


function keyPressed() {
  if (key === 'n' || key === 'N') {
    currentScene++;

    // Agora temos 4 cenários (0, 1, 2, 3), então volta para 0 se passar de 3
    if (currentScene > 3) {
      currentScene = 0;
    }

    // SEMPRE chama resetSceneElements para garantir que a próxima cena seja iniciada corretamente
    resetSceneElements();
  }
}

// --- NOVA FUNÇÃO PARA RESETAR ELEMENTOS DA CENA ---
function resetSceneElements() {
  const groundY = TRUCK_Y_BASE + CHARACTER_GROUND_Y_OFFSET;

  if (currentScene === 0) { // Se for para o campo (recomeço)
    // Redefinição completa para garantir uma tela limpa e o estado inicial
    truckX = -200;
    showTruck = false;
    startTime = millis(); // Reinicia o tempo para o caminhão aparecer
    riceSeeds = []; // Limpa sementes
    showCharacter = false; // Garante que o personagem azul não esteja visível
    characterX = truckX + TRUCK_WIDTH - 20; // Posição inicial do personagem (fora da tela com o caminhão)
    characterY = TRUCK_Y_BASE + CHARACTER_START_Y_OFFSET;
    characterState = 0; // Reseta o estado do boneco azul
    showSacks = false; // Esconde as sacolas
    showCharacterSpeech = false;
    speechDisplayTime = 0;
    showSecondCharacter = false; // Garante que o segundo personagem não esteja visível
    showSecondCharacterSpeech = false;
    secondSpeechDisplayTime = 0;
    showSecondCharacterSpeech2 = false;
    secondSpeechDisplayTime2 = 0;
    secondCharacterX = 0; // Posição inicial para o segundo boneco
    secondCharacterY = 0;
    showGreenSpeechFair1 = false; // Resetar as falas da feira
    greenSpeechFairTime1 = 0;
    showGreenSpeechFair2 = false;
    greenSpeechFairTime2 = 0;
    showCornInStall = false; // Garante que o milho não apareça no campo
    finalSceneTransitionTime = 0; // Reseta o contador de tempo para a cena final
    showInstructions = false; // NOVO: Esconde as instruções ao reiniciar para a cena 0
  } else if (currentScene === 1) { // Se for para a cidade
    truckX = -200; // Caminhão começa do lado esquerdo para entrar na cidade
    showTruck = true; // Caminhão começa a se mover na cidade
    riceSeeds = []; // Limpa sementes (se por acaso ainda houver)
    showCharacter = false; // Esconde o boneco até o caminhão parar
    characterX = (width / 2) - (TRUCK_WIDTH / 2) + TRUCK_WIDTH - 20; // Posição X inicial do boneco na cabine
    characterY = TRUCK_Y_BASE + CHARACTER_START_Y_OFFSET; // Posição Y inicial do boneco (no caminhão)
    characterState = 0; // Reseta o estado para começar a descer
    truckStoppedTime = 0; // Reseta o contador de tempo parado
    showSacks = false; // Garante que as sacolas não apareçam antes da hora
    showCharacterSpeech = false;
    speechDisplayTime = 0;
    showSecondCharacter = false;
    showSecondCharacterSpeech = false;
    secondSpeechDisplayTime = 0;
    showSecondCharacterSpeech2 = false;
    secondSpeechDisplayTime2 = 0;
    secondCharacterX = 0;
    secondCharacterY = 0;
    showGreenSpeechFair1 = false;
    greenSpeechFairTime1 = 0;
    showGreenSpeechFair2 = false;
    greenSpeechFairTime2 = 0;
    showCornInStall = false; // Garante que o milho não apareça na cidade
    finalSceneTransitionTime = 0; // Reseta o contador de tempo para a cena final
  } else if (currentScene === 2) { // Se for para a feira
    // Posiciona os personagens para entrar pela esquerda e andar até a barraca de milho
    characterX = -50;
    secondCharacterX = -100; // Verde atrás do azul para a entrada
    characterY = groundY;
    secondCharacterY = groundY;
    showCharacter = true;
    showSecondCharacter = true;
    showSacks = true; // Tião ainda está com as sacolas
    characterState = 4; // Começa no estado de andando
    // Resetar falas, etc, para o novo cenário
    showCharacterSpeech = false;
    showSecondCharacterSpeech = false;
    showSecondCharacterSpeech2 = false;
    showGreenSpeechFair1 = false;
    greenSpeechFairTime1 = 0;
    showGreenSpeechFair2 = false;
    greenSpeechFairTime2 = 0;
    showCornInStall = false; // Começa sem o milho na barraca, ele aparecerá ao chegar
    finalSceneTransitionTime = 0; // Garante que o contador de tempo para a cena final esteja zerado ao entrar na feira
  } else if (currentScene === 3) { // NOVO BLOCO PARA O CENÁRIO FINAL
    showCharacter = false;
    showSecondCharacter = false;
    showSacks = false;
    characterState = 5;

    characterX = width * 0.4;
    characterY = height * 0.7 - 60;
    secondCharacterX = width * 0.6;
    secondCharacterY = height * 0.7 - 60;

    showCharacterSpeech = false;
    showSecondCharacterSpeech = false;
    showSecondCharacterSpeech2 = false;
    showGreenSpeechFair1 = false;
    showGreenSpeechFair2 = false;
    showCornInStall = false;
    truckX = -200;
    showTruck = false;
    riceSeeds = [];
    finalSceneTransitionTime = 0;
  }
}