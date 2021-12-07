async function getAllProducts() {
    let query = `
        query {
            products{
                id
                title
                price
                thumbnail
            }
        }
    `
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            query
        })
    })
    const data = await response.json();

    return data;

}

async function saveProduct(variables) {
    let query = `
        mutation saveProduct($title: String!, $price: Float!, $thumbnail: String) { 
            saveProduct(title: $title, price: $price, thumbnail: $thumbnail) {
            id
            title
            price
            thumbnail
        }
    }`
    const response = await fetch('/graphql', {
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            query,
            variables
        })
    });
    const data = await response.json();
    if (response.status == 200) {
        return data;
    } else {
        console.log(data);
        throw new Error('Error al guardar');
    }
}

async function findById(variables) {
    try {
        let query = `
        query getProductById($id: String!) {
            product(id: $id) {
                id
                title
                price
                thumbnail
            }
        }`

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query,
                variables
            })
        });
        const data = await response.json();
        if (response.status == 200) {
            return data;
        } else {
            console.log(data);
            throw new Error('Error al buscar por id');
        }
    } catch (error) {
        console.log(error);
    }

}

async function updateProduct(variables) {
    let query = `
        mutation updateProduct($id: String!, $title: String!, $price: Float!, $thumbnail: String) { 
            updateProduct(id: $id, title: $title, price: $price, thumbnail: $thumbnail) {
            id
            title
            price
            thumbnail
        }
    }`

    const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            query,
            variables
        })
    });
    const data = await response.json();
    if (response.status == 200) {
        return data;
    } else {
        console.log(data);
        throw new Error('Error al actualizar');
    }

}

async function deleteProduct(variables) {
    let query = `
        mutation deleteProduct($id: String!) { 
            deleteProduct(id: $id) {
            id
        }
    }`
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            query,
            variables
        })
    });
    const data = await response.json();
    if (response.status == 200) {
        return data;
    } else {
        console.log(data);
        throw new Error('Error al eliminar');
    }
}

export { getAllProducts, saveProduct, findById, updateProduct, deleteProduct };