import api from './api';

class App {
    constructor() {
        this.repositorio = [];

        this.formElement = document.getElementById('repo-form');
        this.inputElement = document.querySelector('input[name=repository]');
        this.listElement = document.getElementById('repo-list');

        this.registerHandlers();
    }

    setLoading(loading = true) {
        if (loading === true) {
            let loadingElement = document.createElement('span');
            loadingElement.appendChild(document.createTextNode('Carregando'));
            loadingElement.setAttribute('id', 'loading');

            this.formElement.appendChild(loadingElement);
        } else {
            document.getElementById('loading').remove();
        }
    }

    registerHandlers() { //registra o evento (clicar no submit do form) e armazena na nossa variavel
        this.formElement.onsubmit = event => this.addRepositorio(event);
    }

    async addRepositorio(event) {
        event.preventDefault(); //recebe o evento e previni que a pagina recarregue

        const repoInput = this.inputElement.value;

        if (repoInput.lenght === 0)
            return;

        this.setLoading();

        try {
            const response = await api.get(`/repos/${repoInput}`);

            const { name, description, html_url, owner: { avatar_url } } = response.data;

            this.repositorio.push({
                name,
                description,
                avatar_url,
                html_url,
            });

            console.log(response);

            this.inputElement.value = '';

            this.render(); //ele apaga todo o conteudo da lista e renderiza do zero mostrando todos os elemento
        } catch {
            alert('Este repositório não existe !');
        }

        this.setLoading(false);
    }

    render() {
        this.listElement.innerHTML = ''; //apaga todo o conteudo da nossa list e monstra cada um dos repo la dentro

        this.repositorio.forEach(repo => {
            let imgElement = document.createElement('img'); //cria o elemento e coloca na variavel
            imgElement.setAttribute('src', repo.avatar_url);  //seta a url da imagem dentro da variavel que vai criar o elemento em tela

            let titleElement = document.createElement('strong');
            titleElement.appendChild(document.createTextNode(repo.name));

            let descriElement = document.createElement('p');
            descriElement.appendChild(document.createTextNode(repo.description));

            let htmlElement = document.createElement('a');
            htmlElement.setAttribute('target', '_blank');
            htmlElement.setAttribute('href', repo.html_url);
            htmlElement.appendChild(document.createTextNode('Acessar'));

            let listItemElement = document.createElement('li');
            listItemElement.appendChild(imgElement);
            listItemElement.appendChild(titleElement);
            listItemElement.appendChild(descriElement);
            listItemElement.appendChild(htmlElement);

            this.listElement.appendChild(listItemElement);
        });
    }
}

new App();