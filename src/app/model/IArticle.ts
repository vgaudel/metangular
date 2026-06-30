export interface IArticle{
    id: number;
    nom: string;
    prix: number;
    categorie: 'fruit' | 'legume' | 'boisson';
    stock: number;
}