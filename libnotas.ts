import { readFile, writeFile, readFileSync } from 'fs';
import { argv } from 'process';

// @filename libnotas.ts

/* API da aplicação de notas.
 * Por Luiz Paulo de Lima Araújo
 */ 

//tipos de dado que o programa lida.

type Nota =
{
    titulo: string;
    nota: string;
};

class Arquivo
{
    
    protected notas: Array<Nota>;

	constructor()
	{
        this.notas = [{ titulo:"", nota:"" }];
	}

    /*Início do programa*/
    public lerArquivoJSON(): void 
    {
        //De forma síncrona e não assincrona.
        this.notas = JSON.parse( readFileSync( './NOTAS.json', { encoding: "utf-8" } ) );
    }

    /*Fim do programa*/
    public atualizarArquivoJSON(): void
    {
        writeFile('./NOTAS.json', JSON.stringify( this.notas ), ( err: NodeJS.ErrnoException | null)=>
        {
            if(err) throw err;
        });
        return;
    }

};

class Notas extends Arquivo
{
    constructor()
    {
        super();
    }

    /* retora a posição da nota com o titulo buscado ou undefined */
    public buscarTitulo( titulo: string ): number | undefined
    {
        for( let nota = 0; nota < this.notas.length; nota++ )
        {
            if( this.notas[ nota ].titulo == titulo )
            {
                return nota;
            }
        }
        return undefined;
    }

    public criarNota( titulo: string, nota: string ): void
    {
        this.notas.push( { titulo: titulo, nota: nota } );
    }

    public listarTitulos(): void
    {
        for( let nota = 0; nota < this.notas.length; nota++ )
        {
            if( typeof this.notas[ nota ].titulo != "undefined" )
                console.log( this.notas[ nota ].titulo );
        }
    }

    public excluirNota( titulo: string ): void
    {
        let posicao: number | undefined = this.buscarTitulo( titulo );
        if( typeof posicao != "undefined" )
        {
            this.notas.splice( posicao, 1 );
        }
        else
        {
            console.log( 'Nota de nome: "' + titulo + '" não existe.' );
        }
    }

    public editarNota( titulo: string, nota: string ): void
    {
        let posicao: number | undefined = this.buscarTitulo( titulo );
        if( typeof posicao != "undefined" )
        {
            this.notas[ posicao ].titulo = titulo;
            this.notas[ posicao ].nota = nota;
        }
        else
        {
            console.log( 'Nota de nome: "' + titulo + '" não existe.' );
        }
    }

    public lerNota( titulo: string ): void
    {
        let posicao: number | undefined = this.buscarTitulo( titulo );
        if( typeof posicao != "undefined" )
        {
            console.log( "---------------------------------------------------" );
            console.log( this.notas[ posicao ].titulo + '\n' + this.notas[ posicao ].nota );
            console.log( "---------------------------------------------------" );
        }
        else
        {
            console.log( 'Nota de nome: "' + titulo + '" não existe.' );
        }
    }

    public Notas(): void
    {
        this.lerArquivoJSON();
        switch( argv[2] )
        {
            case "listar":
                this.listarTitulos();
                break;
            case "ler":
                if( argv[3] != undefined )
                {
                    this.lerNota( argv[3] );
                }
                else console.log( "ERRO: título da nota não passado." );
                break;
            case "criar":
                if( argv[3] != undefined && argv[4] != undefined )
                {
                    this.criarNota( argv[3], argv[4] );
                }
                else console.log( "ERRO: argumentos inválidos." );
                break;
            case "excluir":
                if( argv[3] != undefined )
                {
                    this.excluirNota( argv[3] );
                }
                else console.log( "ERRO: título da nota não passado." );
                break;
            case "editar":
                if( argv[3] != undefined && argv[4] != undefined )
                {
                    this.editarNota( argv[3], argv[4] );
                }
                else console.log( "ERRO: argumentos inválidos." );
                break;
            case "ajuda":
                console.log
                (
                    "node notas.js AÇÂO\
                    \nações\
                    \n\tler 'TITULO'\
                    \n\tcriar 'TITULO' 'NOTA'\
                    \n\texcluir 'TITULO'\
                    \n\teditar 'TITULO' 'NOTA_MODIFICAR'\
                    \n\tajuda"
                );
                break;
            default:
                console.log( "Não farei nada." );
        }
        this.atualizarArquivoJSON();
    }

}

export { Notas };
