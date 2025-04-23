/**
 * Módulo do Agente de IA para o SaaS Compranet
 * Implementa um assistente virtual para automatizar tarefas e navegação
 */

// Classe principal do Agente de IA
class ComprasnetAgent {
  constructor() {
    this.name = 'Assistente Compranet';
    this.version = '1.0.0';
    this.context = {
      currentModule: null,
      searchParams: {},
      lastResults: [],
      userPreferences: {}
    };
    
    // Inicializa o histórico de conversas
    this.conversationHistory = [];
    
    // Inicializa o elemento de chat
    this.chatContainer = null;
    this.chatMessages = null;
    this.chatInput = null;
  }
  
  // Inicializa o agente
  init() {
    console.log(`${this.name} v${this.version} inicializado`);
    this.createChatInterface();
    this.setupEventListeners();
    this.sendWelcomeMessage();
  }
  
  // Cria a interface de chat
  createChatInterface() {
    // Cria o container principal do chat
    this.chatContainer = document.createElement('div');
    this.chatContainer.className = 'agent-chat-container';
    
    // Cria o cabeçalho do chat
    const chatHeader = document.createElement('div');
    chatHeader.className = 'agent-chat-header';
    chatHeader.innerHTML = `
      <div class="agent-chat-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#4299e1" opacity="0.2"/>
          <path d="M8 12L11 15L16 9" stroke="#4299e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>${this.name}</span>
      </div>
      <div class="agent-chat-controls">
        <button id="agent-chat-minimize" class="agent-chat-control-btn">−</button>
        <button id="agent-chat-close" class="agent-chat-control-btn">×</button>
      </div>
    `;
    
    // Cria a área de mensagens
    this.chatMessages = document.createElement('div');
    this.chatMessages.className = 'agent-chat-messages';
    
    // Cria o formulário de entrada
    const chatForm = document.createElement('form');
    chatForm.className = 'agent-chat-form';
    
    this.chatInput = document.createElement('input');
    this.chatInput.type = 'text';
    this.chatInput.className = 'agent-chat-input';
    this.chatInput.placeholder = 'Digite sua mensagem...';
    
    const chatSubmit = document.createElement('button');
    chatSubmit.type = 'submit';
    chatSubmit.className = 'agent-chat-submit';
    chatSubmit.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    
    // Monta a estrutura do chat
    chatForm.appendChild(this.chatInput);
    chatForm.appendChild(chatSubmit);
    
    this.chatContainer.appendChild(chatHeader);
    this.chatContainer.appendChild(this.chatMessages);
    this.chatContainer.appendChild(chatForm);
    
    // Adiciona o chat ao corpo do documento
    document.body.appendChild(this.chatContainer);
    
    // Adiciona estilos CSS
    this.addChatStyles();
  }
  
  // Adiciona os estilos CSS para o chat
  addChatStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .agent-chat-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        height: 500px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        z-index: 1000;
        overflow: hidden;
      }
      
      .agent-chat-header {
        padding: 15px;
        background-color: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .agent-chat-title {
        display: flex;
        align-items: center;
        font-weight: 600;
        color: #2d3748;
      }
      
      .agent-chat-title svg {
        margin-right: 8px;
      }
      
      .agent-chat-controls {
        display: flex;
      }
      
      .agent-chat-control-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #718096;
        margin-left: 5px;
      }
      
      .agent-chat-messages {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
      
      .agent-chat-message {
        margin-bottom: 15px;
        max-width: 80%;
        padding: 10px 15px;
        border-radius: 18px;
        line-height: 1.4;
        font-size: 14px;
      }
      
      .agent-message {
        align-self: flex-start;
        background-color: #f8fafc;
        color: #2d3748;
        border-bottom-left-radius: 5px;
      }
      
      .user-message {
        align-self: flex-end;
        background-color: #4299e1;
        color: white;
        border-bottom-right-radius: 5px;
      }
      
      .agent-chat-form {
        padding: 15px;
        border-top: 1px solid #e2e8f0;
        display: flex;
      }
      
      .agent-chat-input {
        flex: 1;
        padding: 10px 15px;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        font-size: 14px;
        outline: none;
      }
      
      .agent-chat-submit {
        background-color: #4299e1;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-left: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .agent-chat-minimized {
        height: 60px;
      }
      
      .agent-chat-minimized .agent-chat-messages,
      .agent-chat-minimized .agent-chat-form {
        display: none;
      }
      
      .agent-typing {
        align-self: flex-start;
        background-color: #f8fafc;
        color: #718096;
        padding: 10px 15px;
        border-radius: 18px;
        font-size: 14px;
        margin-bottom: 15px;
      }
      
      .agent-typing::after {
        content: "...";
        animation: typing 1.5s infinite;
      }
      
      @keyframes typing {
        0% { content: "."; }
        33% { content: ".."; }
        66% { content: "..."; }
      }
    `;
    
    document.head.appendChild(styleElement);
  }
  
  // Configura os listeners de eventos
  setupEventListeners() {
    // Listener para o formulário de chat
    const chatForm = this.chatContainer.querySelector('.agent-chat-form');
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = this.chatInput.value.trim();
      if (message) {
        this.handleUserMessage(message);
        this.chatInput.value = '';
      }
    });
    
    // Listener para minimizar o chat
    const minimizeBtn = document.getElementById('agent-chat-minimize');
    minimizeBtn.addEventListener('click', () => {
      this.chatContainer.classList.toggle('agent-chat-minimized');
      minimizeBtn.textContent = this.chatContainer.classList.contains('agent-chat-minimized') ? '+' : '−';
    });
    
    // Listener para fechar o chat
    const closeBtn = document.getElementById('agent-chat-close');
    closeBtn.addEventListener('click', () => {
      this.chatContainer.style.display = 'none';
    });
  }
  
  // Envia mensagem de boas-vindas
  sendWelcomeMessage() {
    setTimeout(() => {
      this.addMessage('Olá! Sou o Assistente Compranet, seu agente de IA para ajudar com o portal de compras públicas. Como posso ajudar você hoje?', 'agent');
    }, 500);
  }
  
  // Adiciona uma mensagem ao chat
  addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `agent-chat-message ${sender}-message`;
    messageElement.textContent = text;
    
    this.chatMessages.appendChild(messageElement);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    
    // Adiciona a mensagem ao histórico
    this.conversationHistory.push({
      sender: sender,
      text: text,
      timestamp: new Date().toISOString()
    });
  }
  
  // Mostra indicador de digitação
  showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'agent-typing';
    typingElement.id = 'agent-typing';
    this.chatMessages.appendChild(typingElement);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
  
  // Remove indicador de digitação
  removeTypingIndicator() {
    const typingElement = document.getElementById('agent-typing');
    if (typingElement) {
      typingElement.remove();
    }
  }
  
  // Processa mensagem do usuário
  handleUserMessage(message) {
    // Adiciona a mensagem do usuário ao chat
    this.addMessage(message, 'user');
    
    // Mostra indicador de digitação
    this.showTypingIndicator();
    
    // Processa a mensagem e gera resposta (com delay simulado para parecer mais natural)
    setTimeout(() => {
      this.removeTypingIndicator();
      
      // Gera resposta baseada na mensagem do usuário
      const response = this.generateResponse(message);
      this.addMessage(response, 'agent');
      
      // Executa ações baseadas na mensagem
      this.executeActions(message);
    }, 1000 + Math.random() * 1000);
  }
  
  // Gera resposta baseada na mensagem do usuário
  generateResponse(message) {
    const messageLower = message.toLowerCase();
    
    // Respostas para diferentes tipos de consultas
    if (messageLower.includes('licitação') || messageLower.includes('licitacoes') || messageLower.includes('pregão')) {
      return 'Posso ajudar você a buscar licitações no Compranet. Gostaria de ver as licitações mais recentes ou fazer uma busca específica?';
    }
    
    if (messageLower.includes('contrato') || messageLower.includes('contratos')) {
      return 'Posso ajudar você a consultar contratos no Compranet. Gostaria de ver os contratos vigentes ou buscar por um fornecedor específico?';
    }
    
    if (messageLower.includes('dashboard') || messageLower.includes('painel') || messageLower.includes('resumo')) {
      return 'O dashboard mostra um resumo das licitações e contratos. Vou abrir o dashboard para você visualizar os dados consolidados.';
    }
    
    if (messageLower.includes('ajuda') || messageLower.includes('help') || messageLower.includes('como usar')) {
      return 'Posso ajudar você a navegar pelo sistema. Você pode me pedir para buscar licitações, consultar contratos, abrir o dashboard, ou qualquer outra funcionalidade do sistema. O que você gostaria de fazer?';
    }
    
    if (messageLower.includes('buscar') || messageLower.includes('pesquisar') || messageLower.includes('procurar')) {
      if (messageLower.includes('licitação') || messageLower.includes('licitacoes')) {
        return 'Vou preparar uma busca de licitações para você. Você pode especificar termos, modalidade ou período?';
      }
      if (messageLower.includes('contrato') || messageLower.includes('contratos')) {
        return 'Vou preparar uma busca de contratos para você. Você pode especificar o fornecedor, situação ou período?';
      }
      return 'O que você gostaria de buscar? Posso ajudar com licitações, contratos ou fornecedores.';
    }
    
    // Resposta padrão
    return 'Entendi. Como posso ajudar você com o portal Compranet? Posso buscar licitações, consultar contratos, mostrar o dashboard ou navegar pelo sistema.';
  }
  
  // Executa ações baseadas na mensagem do usuário
  executeActions(message) {
    const messageLower = message.toLowerCase();
    
    // Navega para diferentes módulos
    if (messageLower.includes('abrir dashboard') || messageLower.includes('mostrar dashboard') || messageLower.includes('ver dashboard')) {
      this.navigateToModule('dashboard');
    }
    
    if (messageLower.includes('abrir licitações') || messageLower.includes('mostrar licitações') || messageLower.includes('ver licitações')) {
      this.navigateToModule('licitacoes');
    }
    
    if (messageLower.includes('abrir contratos') || messageLower.includes('mostrar contratos') || messageLower.includes('ver contratos')) {
      this.navigateToModule('contratos');
    }
    
    // Executa buscas
    if (messageLower.includes('buscar licitações') || messageLower.includes('pesquisar licitações')) {
      this.navigateToModule('licitacoes');
      // Extrai parâmetros de busca da mensagem
      const searchParams = this.extractSearchParams(message);
      this.performSearch('licitacoes', searchParams);
    }
    
    if (messageLower.includes('buscar contratos') || messageLower.includes('pesquisar contratos')) {
      this.navigateToModule('contratos');
      // Extrai parâmetros de busca da mensagem
      const searchParams = this.extractSearchParams(message);
      this.performSearch('contratos', searchParams);
    }
  }
  
  // Navega para um módulo específico
  navigateToModule(moduleName) {
    // Atualiza o contexto
    this.context.currentModule = moduleName;
    
    // Encontra o link do módulo e simula um clique
    const moduleLink = document.querySelector(`[data-module="${moduleName}"]`);
    if (moduleLink) {
      moduleLink.click();
    } else {
      console.error(`Módulo ${moduleName} não encontrado`);
    }
  }
  
  // Extrai parâmetros de busca da mensagem
  extractSearchParams(message) {
    const params = {};
    const messageLower = message.toLowerCase();
    
    // Extrai termo de busca
    if (messageLower.includes('termo:')) {
      const match = message.match(/termo:\s*([^,\.]+)/i);
      if (match && match[1]) {
        params.termo = match[1].trim();
      }
    }
    
    // Extrai modalidade (para licitações)
    if (messageLower.includes('modalidade:')) {
      const match = message.match(/modalidade:\s*([^,\.]+)/i);
      if (match && match[1]) {
        params.modalidade = match[1].trim();
      }
    }
    
    // Extrai situação
    if (messageLower.includes('situação:') || messageLower.includes('situacao:')) {
      const match = message.match(/situa[çc][aã]o:\s*([^,\.]+)/i);
      if (match && match[1]) {
        params.situacao = match[1].trim();
      }
    }
    
    // Extrai fornecedor (para contratos)
    if (messageLower.includes('fornecedor:')) {
      const match = message.match(/fornecedor:\s*([^,\.]+)/i);
      if (match && match[1]) {
        params.fornecedor = match[1].trim();
      }
    }
    
    // Extrai datas
    if (messageLower.includes('data início:') || messageLower.includes('data inicio:')) {
      const match = message.match(/data in[íi]cio:\s*([^,\.]+)/i);
      if (match && match[1]) {
        params.data_inicio = this.parseDate(match[1].trim());
      }
    }
    
    if (messageLower.includes('data fim:')) {
      const match = message.match(/data fim:\s*([^,\.]+)/i);
      if (match && match[1]) {
        params.data_fim = this.parseDate(match[1].trim());
      }
    }
    
    return params;
  }
  
  // Converte texto de data para formato de data
  parseDate(dateText) {
    // Tenta converter formatos comuns de data
    if (dateText.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateText.split('/');
      return `${year}-${month}-${day}`;
    }
    
    if (dateText.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = dateText.split('-');
      return `${year}-${month}-${day}`;
    }
    
    // Tenta interpretar datas relativas
    if (dateText.includes('hoje')) {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
    
    if (dateText.includes('ontem')) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    
(Content truncated due to size limit. Use line ranges to read in chunks)