import React, { useState } from 'react';
import './App.css';
import { calcularResultadoTACF, calcularMetasTACF } from './logic/calculadora';

function App() {
  const [activeTab, setActiveTab] = useState('metas');

  // --- Estados da Calculadora de Resultado ---
  const [idade, setIdade] = useState('');
  const [estatura, setEstatura] = useState('');
  const [sexo, setSexo] = useState('masculino');
  const [cintura, setCintura] = useState('');
  const [flexaoBraco, setFlexaoBraco] = useState('');
  const [flexaoTronco, setFlexaoTronco] = useState('');
  const [tipoAerobico, setTipoAerobico] = useState('corrida');
  const [distanciaCorrida, setDistanciaCorrida] = useState('');
  const [minutosMarcha, setMinutosMarcha] = useState('');
  const [segundosMarcha, setSegundosMarcha] = useState('');
  const [resultado, setResultado] = useState(null);

  // --- Estados para a Calculadora de Metas ---
  const [sexoMeta, setSexoMeta] = useState('masculino');
  const [idadeMeta, setIdadeMeta] = useState('');
  const [estaturaMeta, setEstaturaMeta] = useState('');
  const [resultadoMetas, setResultadoMetas] = useState(null);

  const handleCalcular = (e) => {
    e.preventDefault();
    const dados = {
      sexo, idade: parseInt(idade), estatura: parseInt(estatura), cintura: parseFloat(cintura),
      flexaoBraco: parseInt(flexaoBraco), flexaoTronco: parseInt(flexaoTronco), tipoAerobico,
      distanciaCorrida: tipoAerobico === 'corrida' ? parseInt(distanciaCorrida) : 0,
      tempoMarchaSegundos: tipoAerobico === 'marcha' ? (parseInt(minutosMarcha || 0) * 60) + parseInt(segundosMarcha || 0) : 0,
    };
    setResultado(calcularResultadoTACF(dados));
  };

  const handleCalcularMetas = (e) => {
    e.preventDefault();
    if (!idadeMeta || !estaturaMeta) {
      alert("Por favor, preencha idade e estatura para calcular as metas.");
      return;
    }
    const dados = { sexo: sexoMeta, idade: parseInt(idadeMeta), estatura: parseInt(estaturaMeta) };
    setResultadoMetas(calcularMetasTACF(dados));
  };

  return (
    <div className="container">
      <header>
        <h1>Calculadora TACF</h1>
        <p>Baseada na NSCA 54-3 de 2024</p>
        <p className="author-credit">Desenvolvido por Rodrigo Ramos</p>
      </header>

      <div className="tab-container">
        <button className={`tab-button ${activeTab === 'metas' ? 'active' : ''}`} onClick={() => setActiveTab('metas')}>
          Calculadora de Metas
        </button>
        <button className={`tab-button ${activeTab === 'resultado' ? 'active' : ''}`} onClick={() => setActiveTab('resultado')}>
          Calculadora de Resultado
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'metas' ? (
          <div className="metas-container">
            <form onSubmit={handleCalcularMetas} className="form-tacf">
              <fieldset>
                <legend>Seus Dados</legend>
                <div className="form-group">
				 <label htmlFor="sexoMeta">Sexo:</label>
				 <select id="sexoMeta" value={sexoMeta} onChange={(e) => setSexoMeta(e.target.value)}>
				  <option value="masculino">Masculino</option>
				  <option value="feminino">Feminino</option>
				 </select>
				</div>
                <div className="form-group"><label htmlFor="idadeMeta">Idade (anos):</label><input type="number" id="idadeMeta" value={idadeMeta} onChange={(e) => setIdadeMeta(e.target.value)} required min="1" /></div>
                <div className="form-group"><label htmlFor="estaturaMeta">Estatura (cm):</label><input type="number" id="estaturaMeta" value={estaturaMeta} onChange={(e) => setEstaturaMeta(e.target.value)} required min="1" /></div>
              </fieldset>
              <button type="submit">Calcular Metas</button>
            </form>

            {resultadoMetas && (
              <div className="resultado-container">
                <h3>Suas Metas:</h3>
                <div className="metas-grid">
                  {/* Card 1: Cintura */}
                  <div className="meta-card">
                    <h4>Circunferência da Cintura</h4>
                    <div className="meta-targets">
                      <div className="meta-target meta-target-apto">
                        <span className="meta-label">✅ Mínimo Apto</span>
                        <span className="meta-value">{resultadoMetas.cintura.minApto}</span>
                      </div>
                      <div className="meta-target meta-target-excelente">
                        <span className="meta-label">⭐ Máximo Excelente</span>
                        <span className="meta-value">{resultadoMetas.cintura.maxExcelente}</span>
                      </div>
                    </div>
                  </div>
                  {/* Card 2: Flexão de Braços */}
                  <div className="meta-card">
                    <h4>Flexão de Braços</h4>
                    <div className="meta-targets">
                      <div className="meta-target meta-target-apto">
                        <span className="meta-label">✅ Mínimo Apto</span>
                        <span className="meta-value">{resultadoMetas.flexaoBraco.minApto}</span>
                      </div>
                      <div className="meta-target meta-target-excelente">
                        <span className="meta-label">⭐ Máximo Excelente</span>
                        <span className="meta-value">{resultadoMetas.flexaoBraco.maxExcelente}</span>
                      </div>
                    </div>
                  </div>
                  {/* Card 3: Flexão de Tronco */}
                  <div className="meta-card">
                    <h4>Flexão de Tronco</h4>
                    <div className="meta-targets">
                      <div className="meta-target meta-target-apto">
                        <span className="meta-label">✅ Mínimo Apto</span>
                        <span className="meta-value">{resultadoMetas.flexaoTronco.minApto}</span>
                      </div>
                      <div className="meta-target meta-target-excelente">
                        <span className="meta-label">⭐ Máximo Excelente</span>
                        <span className="meta-value">{resultadoMetas.flexaoTronco.maxExcelente}</span>
                      </div>
                    </div>
                  </div>
                  {/* Card 4: Corrida */}
                  <div className="meta-card">
                    <h4>Corrida de 12 min</h4>
                    <div className="meta-targets">
                      <div className="meta-target meta-target-apto">
                        <span className="meta-label">✅ Mínimo Apto</span>
                        <span className="meta-value">{resultadoMetas.corrida.minApto}</span>
                      </div>
                      <div className="meta-target meta-target-excelente">
                        <span className="meta-label">⭐ Máximo Excelente</span>
                        <span className="meta-value">{resultadoMetas.corrida.maxExcelente}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // --- CONTEÚDO DA ABA DE RESULTADO ---
          <div>
            <form onSubmit={handleCalcular} className="form-tacf">
			<fieldset>
                <legend>1. Dados do Militar</legend>
                <div className="form-group"><label htmlFor="sexo">Sexo:</label><select id="sexo" value={sexo} onChange={(e) => setSexo(e.target.value)}><option value="masculino">Masculino</option><option value="feminino">Feminino</option></select></div>
                <div className="form-group"><label htmlFor="idade">Idade (anos):</label><input type="number" id="idade" value={idade} onChange={(e) => setIdade(e.target.value)} required min="1" /></div>
                <div className="form-group"><label htmlFor="estatura">Estatura (cm):</label><input type="number" id="estatura" value={estatura} onChange={(e) => setEstatura(e.target.value)} required min="1" /></div>
              </fieldset>
              <fieldset>
                <legend>2. Resultados dos Testes</legend>
                <div className="form-group"><label htmlFor="cintura">Circunferência da Cintura (cm):</label><input type="number" step="0.1" id="cintura" value={cintura} onChange={(e) => setCintura(e.target.value)} required min="0" /></div>
                <div className="form-group"><label htmlFor="flexaoBraco">Flexão de Braços (repetições):</label><input type="number" id="flexaoBraco" value={flexaoBraco} onChange={(e) => setFlexaoBraco(e.target.value)} required min="0" /></div>
                <div className="form-group"><label htmlFor="flexaoTronco">Flexão de Tronco (repetições em 1 min):</label><input type="number" id="flexaoTronco" value={flexaoTronco} onChange={(e) => setFlexaoTronco(e.target.value)} required min="0" /></div>
                <div className="form-group-radio"><label>Teste Aeróbico:</label><div><input type="radio" id="corrida" name="tipoAerobico" value="corrida" checked={tipoAerobico === 'corrida'} onChange={(e) => setTipoAerobico(e.target.value)} /><label htmlFor="corrida">Corrida de 12 min</label></div><div><input type="radio" id="marcha" name="tipoAerobico" value="marcha" checked={tipoAerobico === 'marcha'} onChange={(e) => setTipoAerobico(e.target.value)} /><label htmlFor="marcha">Marcha de 4,8 km</label></div></div>
                {tipoAerobico === 'corrida' ? (<div className="form-group"><label htmlFor="distanciaCorrida">Distância da Corrida (metros):</label><input type="number" id="distanciaCorrida" value={distanciaCorrida} onChange={(e) => setDistanciaCorrida(e.target.value)} required min="0" /></div>) : (<div className="form-group-inline"><label>Tempo da Marcha:</label><input type="number" placeholder="Minutos" value={minutosMarcha} onChange={(e) => setMinutosMarcha(e.target.value)} required min="0" /><span>:</span><input type="number" placeholder="Segundos" value={segundosMarcha} onChange={(e) => setSegundosMarcha(e.target.value)} required min="0" max="59" /></div>)}
              </fieldset>
              <button type="submit">Calcular Resultado</button>
            </form>
            {resultado && (
              <div className="resultado-container">
                <h2>Resultado Final</h2>
                <div className={`resultado-apreciacao ${resultado.apreciacao === 'APTO' ? 'apto' : 'nao-apto'}`}>{resultado.apreciacao}</div>
                <p><strong>Conceituação Global:</strong> {resultado.conceituacao}</p><p><strong>Grau Final:</strong> {resultado.grauFinal} pontos</p>
                <details open><summary>Ver Detalhes da Pontuação</summary>
                  <ul>
                    <li>Circunferência da Cintura: {resultado.pontos.cintura} pontos</li><li>Flexão de Braços: {resultado.pontos.flexaoBraco} pontos</li>
                    <li>Flexão de Tronco: {resultado.pontos.flexaoTronco} pontos</li><li>Teste Aeróbico: {resultado.pontos.aerobico} pontos</li>
                  </ul>
                </details>
              </div>
            )}
          </div>
        )}
      </div>
      {/* ===== INÍCIO DA ALTERAÇÃO ===== */}
      <footer className="app-footer">
        <p>VERSÃO BETA - 2025</p>
      </footer>
      {/* ===== FIM DA ALTERAÇÃO ===== */}
    </div>
  );
}

export default App;