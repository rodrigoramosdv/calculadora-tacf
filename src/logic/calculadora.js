// src/logic/calculadora.js

import { PONTOS, CONCEITOS, METAS_EXCELENCIA } from './tabelas';

// --- FUNÇÕES AUXILIARES DE BUSCA DE COLUNA ---

function getColunaEstatura(estatura, sexo) {
  if (sexo === 'feminino') {
    if (estatura <= 161) return '≤161';
    if (estatura <= 166) return '162-166';
    return '≥167';
  }
  // Masculino
  if (estatura <= 166) return '≤166';
  if (estatura <= 171) return '167-171';
  if (estatura <= 175) return '172-175';
  if (estatura <= 180) return '176-180';
  if (estatura <= 188) return '181-188';
  return '≥189';
}

function getColunaIdade(idade, sexo, teste) {
  const faixas = {
    masculino: {
      flexaoBraco: { 20:'≤20', 30:'21-30', 34:'31-34', 38:'35-38', 41:'39-41', 43:'42-43', 49:'44-49', 52:'50-52', 99:'≥53' },
      flexaoTronco: { 27:'≤27', 30:'28-30', 33:'31-33', 35:'34-35', 38:'36-38', 41:'39-41', 44:'42-44', 50:'45-50', 99:'≥51' },
      corrida: { 29:'≤29', 31:'30-31', 35:'32-35', 38:'36-38', 41:'39-41', 43:'42-43', 47:'44-47', 99:'≥48' },
    },
	// ***** INÍCIO DA ALTERAÇÃO *****
    // Preenchendo as faixas de idade para o sexo feminino										  
    feminino: {
      flexaoBraco: { 29:'≤29', 40:'30-40', 44:'41-44', 99:'≥45' },
      flexaoTronco: { 23:'≤23', 25:'24-25', 28:'26-28', 30:'29-30', 34:'31-34', 38:'35-38', 41:'39-41', 45:'42-45', 49:'46-49', 99:'≥50' },
      corrida: { 29:'≤29', 33:'30-33', 38:'34-38', 44:'39-44', 99:'≥45' },
    },
    // ***** FIM DA ALTERAÇÃO *****
  };
  const faixaTeste = faixas[sexo]?.[teste];
  if (!faixaTeste) return null;
  const limiteIdade = Object.keys(faixaTeste).find(limite => idade <= parseInt(limite));
  return faixaTeste[limiteIdade];
}

// --- FUNÇÃO GENÉRICA DE BUSCA DE PONTOS (VERSÃO CORRIGIDA) ---

function buscarPontos(tabela, coluna, valorUsuario, tipoBusca) {
  if (!tabela || tabela.length === 0 || !coluna) return 0;
  
  const chaveValor = 'v';
  let linhaCorreta = null;

  if (tipoBusca === 'performance') { // Para reps, distância (quanto maior, melhor)
    // Itera de trás para frente (do melhor para o pior) para encontrar o primeiro valor menor ou igual
    for (let i = tabela.length - 1; i >= 0; i--) {
      if (tabela[i][chaveValor] <= valorUsuario) {
        linhaCorreta = tabela[i];
        break; 
      }
    }
  } else { // 'medida' -> Para cintura, tempo (quanto menor, melhor)
    const melhorValorDaTabela = tabela[tabela.length - 1][chaveValor];
    if (valorUsuario <= melhorValorDaTabela) {
      return 30.0; // Se o valor do usuário é melhor que o melhor da tabela, pontuação máxima.
    }
    
    // Itera do início para o fim (do pior para o melhor) para encontrar o primeiro valor menor ou igual
    for (let i = 0; i < tabela.length; i++) {
      if (tabela[i][chaveValor] <= valorUsuario) {
        linhaCorreta = tabela[i];
        break;
      }
    }
  }
  
  return linhaCorreta?.[coluna] !== undefined ? linhaCorreta[coluna] : 0;
}

										 

// --- FUNÇÃO PRINCIPAL DE CÁLCULO (sem alterações) ---

export function calcularResultadoTACF(dados) {
  const { sexo, idade, estatura, cintura, flexaoBraco, flexaoTronco, tipoAerobico, distanciaCorrida, tempoMarchaSegundos } = dados;

  const conceitosDoSexo = CONCEITOS[sexo];
  if (!conceitosDoSexo) return null;

  let conceitosIndividuais = { apto: true, motivos: [] };

  const regraCintura = conceitosDoSexo.cintura.find(r => estatura >= r.estaturaMin && estatura <= r.estaturaMax);
  if (regraCintura && cintura >= regraCintura.naoSatisfatorioAte) {
      conceitosIndividuais.apto = false;
      conceitosIndividuais.motivos.push('Cintura');
  }

  const regraFlexaoBraco = conceitosDoSexo.flexaoBraco.find(r => idade >= r.idadeMin && idade <= r.idadeMax);
  if (regraFlexaoBraco && flexaoBraco <= regraFlexaoBraco.naoSatisfatorioAte) {
      conceitosIndividuais.apto = false;
      conceitosIndividuais.motivos.push('Flexão de Braços');
  }
  
  const regraFlexaoTronco = conceitosDoSexo.flexaoTronco.find(r => idade >= r.idadeMin && idade <= r.idadeMax);
  if (regraFlexaoTronco && flexaoTronco <= regraFlexaoTronco.naoSatisfatorioAte) {
      conceitosIndividuais.apto = false;
      conceitosIndividuais.motivos.push('Flexão de Tronco');
  }

  if (tipoAerobico === 'corrida') {
    const regraCorrida = conceitosDoSexo.corrida.find(r => idade >= r.idadeMin && idade <= r.idadeMax);
    if (regraCorrida && distanciaCorrida <= regraCorrida.naoSatisfatorioAte) {
        conceitosIndividuais.apto = false;
        conceitosIndividuais.motivos.push('Corrida');
    }
  } else {
    const regraMarcha = conceitosDoSexo.marcha.find(r => idade >= r.idadeMin && idade <= r.idadeMax);
    if (regraMarcha && tempoMarchaSegundos >= regraMarcha.naoSatisfatorioAte) {
        conceitosIndividuais.apto = false;
        conceitosIndividuais.motivos.push('Marcha');
    }
  }
  
  const pontos = {
    cintura: buscarPontos(PONTOS[sexo]?.cintura, getColunaEstatura(estatura, sexo), cintura, 'medida'),
    flexaoBraco: buscarPontos(PONTOS[sexo]?.flexaoBraco, getColunaIdade(idade, sexo, 'flexaoBraco'), flexaoBraco, 'performance'),
    flexaoTronco: buscarPontos(PONTOS[sexo]?.flexaoTronco, getColunaIdade(idade, sexo, 'flexaoTronco'), flexaoTronco, 'performance'),
    aerobico: tipoAerobico === 'corrida' 
      ? buscarPontos(PONTOS[sexo]?.corrida, getColunaIdade(idade, sexo, 'corrida'), distanciaCorrida, 'performance')
      : 0
  };
  
  const grauFinal = pontos.cintura + pontos.flexaoBraco + pontos.flexaoTronco + pontos.aerobico;

  let apreciacao = "NÃO APTO";
  if (grauFinal >= 20 && conceitosIndividuais.apto) {
    apreciacao = "APTO";
  }

  let conceituacao = "INSATISFATÓRIO (I)";
  if (apreciacao === "APTO") {
    if (grauFinal >= 90) conceituacao = "EXCELENTE (E)";
    else if (grauFinal >= 70) conceituacao = "MUITO BOM (MB)";
    else if (grauFinal >= 40) conceituacao = "BOM (B)";
    else conceituacao = "SATISFATÓRIO (S)";
  }

  return {
    apreciacao,
    conceituacao,
    grauFinal: grauFinal.toFixed(1),
    pontos: {
      cintura: pontos.cintura.toFixed(1),
      flexaoBraco: pontos.flexaoBraco.toFixed(1),
      flexaoTronco: pontos.flexaoTronco.toFixed(1),
      aerobico: pontos.aerobico.toFixed(1),
    },
  };
}

// 2. Adicionar a NOVA FUNÇÃO para calcular as metas
export function calcularMetasTACF(dados) {
  const { sexo, idade, estatura } = dados;

  const conceitos = CONCEITOS[sexo];
  const metas = METAS_EXCELENCIA[sexo];
  if (!conceitos || !metas) return null;

  // Encontrar as regras específicas para a idade/estatura do usuário
  const regraCintura = conceitos.cintura.find(r => estatura >= r.estaturaMin && estatura <= r.estaturaMax);
  const regraFlexaoBraco = conceitos.flexaoBraco.find(r => idade >= r.idadeMin && idade <= r.idadeMax);
  const regraFlexaoTronco = conceitos.flexaoTronco.find(r => idade >= r.idadeMin && idade <= r.idadeMax);
  const regraCorrida = conceitos.corrida.find(r => idade >= r.idadeMin && idade <= r.idadeMax);

  const metaCintura = metas.cintura.find(r => estatura >= r.estaturaMin && estatura <= r.estaturaMax);
  const metaFlexaoBraco = metas.flexaoBraco.find(r => idade >= r.idadeMin && idade <= r.idadeMax);
  const metaFlexaoTronco = metas.flexaoTronco.find(r => idade >= r.idadeMin && idade <= r.idadeMax);
  const metaCorrida = metas.corrida.find(r => idade >= r.idadeMin && idade <= r.idadeMax);

  // Construir o objeto de resultado com as metas
  const resultadoMetas = {
    cintura: {
      minApto: `${(regraCintura.naoSatisfatorioAte - 0.5).toFixed(1)} cm ou menos`,
      maxExcelente: `${metaCintura.meta.toFixed(1)} cm ou menos`
    },
    flexaoBraco: {
      minApto: `${regraFlexaoBraco.naoSatisfatorioAte + 1} repetições`,
      maxExcelente: `${metaFlexaoBraco.meta} repetições ou mais`
    },
    flexaoTronco: {
      minApto: `${regraFlexaoTronco.naoSatisfatorioAte + 1} repetições`,
      maxExcelente: `${metaFlexaoTronco.meta} repetições ou mais`
    },
    corrida: {
      minApto: `${regraCorrida.naoSatisfatorioAte + 10} metros`,
      maxExcelente: `${metaCorrida.meta} metros ou mais`
    }
  };

  return resultadoMetas;
}