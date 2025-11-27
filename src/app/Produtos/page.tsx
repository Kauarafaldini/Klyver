import { BsBoxSeam, GoAlert, AiOutlineBarChart, HiMagnifyingGlass } from "@/icons";

export default function Produtos() {
    return(
        <div className="Container">
            <div className="titleCase">
            <h1>Gestão de produtos</h1>
            <p className="description">Controle de estoque e informações dos produtos.</p>
            </div>
            <button className="AddButton">+ Novo Produto</button>
            
            // Card box produtos
            <div className="totalProducts">
                <p className="BoxProducts">Total de Produtos</p>
                <BsBoxSeam />
                <p className="numberProducts">150</p>
                <p className="ProductsLabel">Produtos</p>
            </div>
            
            // Card box alerta estoque
            <div className="AlertProducts">
                <p className="BoxStock">Total de Produtos</p>
                <GoAlert />
                <p className="numberProducts">2</p>
                <p className="ProductsLabel">Reposição</p>
            </div>
            
            // Card valor total do estoque
            <div className="valueStock">
                <p className="BoxProducts">Valor Total do Estoque</p>
                <AiOutlineBarChart />
                <p className="numberProducts">R$ 915,85</p>
                <p className="ProductsLabel">Investimento em estoque</p>
            </div>

            // Barra de busca e filtros
            <div className="seasrchBar">
                <HiMagnifyingGlass />
                <input type="text" placeholder="Buscar produtos..." className="searchInput" />
                <select className="filterSelect">
                    <option>Todos os tipos</option>
                    <option>Ingredientes</option>
                    <option>Produto final</option>
                </select>
                <select className="filterSelect">
                    <option>Todas categorias</option>
                    <option>Pães</option>
                    <option>Carnes</option>
                    <option>Laticínios</option>
                    <option>Acompanhamentos</option>
                    <option>Bebidas</option>
                </select>
                <select className="filterSelect">
                    <option>Menor estoque</option>
                    <option>Nome A-Z</option>
                    <option>Maior preço</option>
                </select>
            </div>
            <div className="productList">
                <p className="titleProdcts">Lista de Produtos</p>
            </div>
        </div>
    );
};