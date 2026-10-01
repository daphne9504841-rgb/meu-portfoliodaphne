
// Ano no rodapé
const ano = document.getElementById("ano");
if (ano) ano.textContent = new Date().getFullYear();

// Conexão com o Supabase (só nas páginas que carregam o config.js)
const db = (typeof supabase !== "undefined" && typeof SUPABASE_URL !== "undefined")
  ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

function mostrar(msg, ok) {
  const el = document.getElementById("msg");
  el.textContent = msg;
  el.className = ok ? "ok" : "erro";
}

// ---------- PORTFÓLIO ----------
const lista = document.getElementById("lista");

async function carregarProjetos() {
  const { data, error } = await db
    .from("projetos")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    lista.innerHTML = "<p class='erro'>Não foi possível carregar os projetos.</p>";
    return;
  }
  if (!data.length) {
    lista.innerHTML = "<p>Nenhum projeto ainda. Cadastre o primeiro abaixo!</p>";
    return;
  }

  lista.innerHTML = "";
  data.forEach((p) => {
    const a = document.createElement("a");
    a.className = "card";
    a.href = p.link;
    a.target = "_blank";
    a.rel = "noopener";

    const h = document.createElement("h3");
    h.textContent = p.titulo;
    const d = document.createElement("p");
    d.textContent = p.descricao;

    a.append(h, d);
    lista.appendChild(a);
  });
}

if (lista && db) {
  carregarProjetos();

  document.getElementById("form-projeto").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const { error } = await db.from("projetos").insert({
      titulo: f.titulo.value.trim(),
      descricao: f.descricao.value.trim(),
      link: f.link.value.trim()
    });
    if (error) return mostrar("Erro ao salvar. O link deve começar com https://", false);
    f.reset();
    mostrar("Projeto salvo!", true);
    carregarProjetos();
  });
}

// ---------- CONTATO ----------
const formContato = document.getElementById("form-contato");

if (formContato && db) {
  formContato.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const { error } = await db.from("contatos").insert({
      nome: f.nome.value.trim(),
      email: f.email.value.trim(),
      mensagem: f.mensagem.value.trim()
    });
    if (error) return mostrar("Erro ao enviar. Tente novamente.", false);
    f.reset();
    mostrar("Mensagem enviada! Obrigada pelo contato.", true);
  });
}