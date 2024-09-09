class Matrix{
    constructor(rows,cols,elements){
        this.rows = rows;
        this.cols = cols;
        this.elements = elements;

        if(elements.length !== rows*cols){
            console.log("O número de elementos não corresponde ao tamanho da matriz")
        }
    }

    get(i,j){
        if(i < 1 || i > this.rows || j < 1 || j > this.cols){
            console.log("Índice fora dos limites da matriz")
        }
        return this.elements[(i-1)*this.cols + (j-1)]
    }

    set(i,j,value){
        if(i < 1 || i >= this.rows || j < 1 || j >= this.cols){
            console.log("Índice fora dos limites da matriz")
        }

        this.elements[(i-1)*this.cols + (j-1)] = value

    }

}

class Vector{
    constructor(dim,elements){
        this.dim = dim;
        this.elements = elements;

        if (elements.length !== dim){
            console.log("O número de elementos não corresponde à dimensão do vetor.")
        }
    }

    get(i){
        if(i<1||i > this.dim){
            console.log("Índice fora dos limites do vetor.")
        }
        return this.elements[i-1]
    }

    set(i,value){
        if(i < 1 || i >= this.dim){
            console.log("Ínice fora dos limites do vetor.")
        }
        this.elements[i-1]= value
    }
}

class LinearAlgebra{
    transpose(a) {
        if (a instanceof Matrix) {
            const transposedElements = [];
            for (let j = 0; j < a.cols; j++) {
                for (let i = 0; i < a.rows; i++) {
                    transposedElements.push(a.get(i + 1, j + 1));

                }
            }

            return new Matrix(a.cols, a.rows, transposedElements)
        } else if (a instanceof Vector) {
            return new Vector(a.dim, [...a.elements]);
        } else {
            throw new Error("Parâmetro deve ser uma matriz ou vetor.");

        }
    }

    solve(A, b, x_inicial, max_iter = 1000, tol = 1e-6) {
        let n = A.rows;
        let x = [...x_inicial];
        let x_old = new Array(n);
        let convergiu = false;

        for (let iter = 0; iter < max_iter; iter++) {

            for (let i = 0; i < n; i++) {
                x_old[i] = x[i];
            }


            for (let i = 0; i < n; i++) {
                let soma = 0;
                for (let j = 0; j < n; j++) {
                    if (j !== i) {
                        soma += A.get(i + 1, j + 1) * x[j];
                    }
                }
                x[i] = (b[i] - soma) / A.get(i + 1, i + 1);
            }


            let erro_max = 0;
            for (let i = 0; i < n; i++) {
                erro_max = Math.max(erro_max, Math.abs(x[i] - x_old[i]));
            }
            if (erro_max < tol) {
                convergiu = true;
                break;
            }
        }

        if (convergiu) {
            console.log("Convergência atingida:");
        } else {
            console.log("Número máximo de iterações atingido:");
        }

        console.log("Solução:");
        for (let i = 0; i < n; i++) {
            console.log(`x[${i + 1}] = ${x[i]}`);
        }
    }

}



let A = new Matrix(3, 3, [
    4, 1, 2,
    3, 5, 1,
    1, 1, 3
]);

let b = [4, 7, 3];
let x_inicial = [0, 0, 0]; //

const calculo = new LinearAlgebra()
calculo.solve(A,b,x_inicial,1000)






