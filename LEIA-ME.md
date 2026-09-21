# AMBER at GEMMA: já está configurado

O backend já está publicado e ligado ao site e ao painel. Falta só subir os arquivos.

- **Conta Google:** tristoncomercial@gmail.com
- **Planilha:** "AMBER — Inscritos": https://docs.google.com/spreadsheets/d/106K5kjCDPTQlsbvHY6PSrSssqahvjYbLS9nnqwAFHfE/edit
- **Script:** "AMBER — Lista (backend)", em script.google.com
- **Senha do painel:** amber-gema-ybej4m (para trocar, edite a SENHA no script e publique uma nova versão)

## Publicar
Suba `index.html`, `admin.html` e `musica.mp3` no GitHub Pages.
- Site: `seudominio/`
- Painel e PDF: `seudominio/admin.html`

---

## Referência: como foi montado (só se precisar refazer)

Arquivos:
- `index.html`: o site da festa com o formulário
- `admin.html`: o seu painel com a lista, busca e os botões **Baixar PDF** e CSV
- `Code.gs`: o backend que salva cada inscrição numa Planilha Google

## 1. Criar a planilha e o backend
1. Crie uma Planilha Google nova (ex.: "AMBER — Inscritos").
2. Menu **Extensões → Apps Script**. Apague o que estiver lá e cole o conteúdo de `Code.gs`.
3. Na linha `const SENHA = "troque-esta-senha"`, coloque uma senha sua.
4. (Opcional) Em **Configurações do projeto**, mude o fuso para `America/Fortaleza`.
5. Clique em **Implantar → Nova implantação → App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
6. Autorize e copie a URL que termina em `/exec`.

## 2. Ligar o site ao backend
Cole a URL `/exec` em dois lugares:
- `index.html`: `SCRIPT_URL: ""` (no bloco CONFIG, no final do arquivo)
- `admin.html`: `const SCRIPT_URL = "";`

## 3. Publicar
Suba `index.html` e `admin.html` num repositório do GitHub Pages (ou na Netlify/Vercel).
- Site: `seudominio/`
- Painel: `seudominio/admin.html` (entre com a senha do passo 1)

## Música
1. Exporte a faixa em **MP3** (de 128 a 192 kbps; um trecho de 1 a 2 minutos em loop carrega rápido).
2. Renomeie o arquivo para `musica.mp3` e suba junto com o `index.html`.
3. Para usar outro nome, troque `MUSIC_URL` no bloco CONFIG. Para tirar a música, deixe `MUSIC_URL: ""`: a tela de entrada some junto.

Os navegadores só tocam som depois de um toque da pessoa, por isso o site abre com a tela **ENTRAR**. Depois disso, o botão no canto inferior direito liga e pausa a música, e o brilho do logo e as brasas pulsam com o grave.

## Como acompanhar os inscritos
- **Ao vivo:** a Planilha Google atualiza a cada inscrição.
- **PDF:** abra o `admin.html` e toque em **Baixar PDF**. O PDF sai com o logo, o total e a data/hora em que foi gerado.
- WhatsApp e Instagram na lista do painel são links: um toque abre a conversa ou o perfil.

## Observações
- Inscrições repetidas (mesmo WhatsApp ou mesmo @) não duplicam; a pessoa vê "você já está na lista".
- Se você mudar o `Code.gs` depois, use **Implantar → Gerenciar implantações → Editar → Nova versão** para a URL continuar a mesma.
- Enquanto o `SCRIPT_URL` estiver vazio, o site funciona em modo demonstração e não salva nada.
