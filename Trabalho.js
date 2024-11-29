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
        if(i < 1 || i > this.rows || j < 1 || j > this.cols){
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
        if(i < 1 || i > this.dim){
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

    sum(a, b){
        const sum = [];
        if(a.rows === b.rows && a.cols === b.cols){
            for(let i=0; i<a.rows*a.cols; i++){
                sum.push(a.elements[i]+b.elements[i])
            }
        }else{
            console.log("Impossível realizar a soma, matrizes de dimensões diferentes.")
        }
        return new Matrix(a.rows, a.cols,sum)
    }

    times(a, b) {
        const multipliedElements = b.elements.map((element) => element*a)
        return new Matrix(b.rows, b.cols,multipliedElements)
    }


    dot(a, b){
        if(a.cols !== b.rows){
            console.log("Impossível realizar a multiplicação");
            return null;
        }
        const mult = new Array(a.rows * b.cols).fill(0);
        for(let i = 0; i < a.rows; i++){
            for(let j = 0; j < b.cols; j++){
                let soma = 0;
                for(let k = 0; k < a.cols; k++){
                    soma += a.elements[i * a.cols + k] * b.elements[k * b.cols + j];
                }
                mult[i * b.cols + j] = soma;
            }
        }
        return new Matrix(a.rows, b.cols, mult);
    }


    solve(A, b, x_inicial) {
        let n = A.rows;
        let x = [...x_inicial];
        let x_old = new Array(n);
        let convergiu = false;

        for (let iter = 0; iter < 5000; iter++) {

            for (let i = 0; i < n; i++) {
                x_old[i] = x[i];
            }

            for (let i = 0; i < n; i++) {
                let soma = 0;
                for (let j = 0; j < n; j++) {
                    if (j !== i) {
                        soma += A.get(i + 1, j + 1) * x_old[j];
                    }
                }
                x[i] = (b[i] - soma) / A.get(i + 1, i + 1);
            }

            let tol = 0.001;
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


        console.log("Soalução:");
        for (let i = 0; i < n; i++) {
            console.log(`x[${i + 1}] = ${x[i]}`);
        }
    }

}

class Transformation{
    algebra = new LinearAlgebra();

    translate2D(vetor, dx, dy){
        if(vetor instanceof Vector){
            if(vetor.dim === 2){
                return new Vector(2, [vetor.elements[0]+dx, vetor.elements[1]+dy]);
            }else{
                console.log("A dimensão do vetor é maior ou menor que 2")
            }

        }else{
            console.log("O argumento passado não é um vetor")
        }
    }


    translate3D(vetor, dx, dy,dz){
        if(vetor instanceof Vector){
            if(vetor.dim === 3){
                return new Vector(3,[vetor.elements[0]+dx, vetor.elements[1]+dy, vetor.elements[2]+dz]);
            }else{
                console.log("A dimensão do vetor é maior ou menor que 3")
            }

        }else{
            console.log("O argumento não é vetor")
        }
    }

    rotation2D(vector,angle){
        if(vector instanceof Vector && vector.dim === 2){
            const matrizRotacao2D = new Matrix(2,2,[
                Math.cos(angle),-Math.sin(angle),
                Math.sin(angle), Math.cos(angle)
            ])

            const vectorEmFormaDeMatriz = new Matrix(2,1,[
                vector.elements[0],
                vector.elements[1],
            ])

            const calculo = new LinearAlgebra()
            const vetorResultadoEmFormaDeMatriz = calculo.dot(matrizRotacao2D,vectorEmFormaDeMatriz);
            return  new Vector(2,[Number(vetorResultadoEmFormaDeMatriz.elements[0].toFixed(3)),Number(vetorResultadoEmFormaDeMatriz.elements[1].toFixed(3))])

        }else{
            console.log("O argumento passado não é um vetor ou tem uma dimensão maior ou menor a 2")
        }




    }

    rotation3DX(vector, angle) {
        if(vector instanceof Vector && vector.dim === 3){
            const matrizRotacao3DX = new Matrix(3, 3, [
                1, 0, 0,
                0, Math.cos(angle), -Math.sin(angle),
                0, Math.sin(angle), Math.cos(angle)
            ]);

            const vetorEmFormaDeMatriz = new Matrix(3, 1, [
                vector.elements[0],
                vector.elements[1],
                vector.elements[2]
            ]);

            const vetorResultadoEmFormaDeMatriz = this.algebra.dot(matrizRotacao3DX, vetorEmFormaDeMatriz);
            return new Vector(3, [Number(vetorResultadoEmFormaDeMatriz.elements[0].toFixed(3)), Number(vetorResultadoEmFormaDeMatriz.elements[1].toFixed(3)), Number(vetorResultadoEmFormaDeMatriz.elements[2].toFixed(3))]);

        }else {
            console.log("O argumento passado não é um vetor ou tem uma dimensão maior ou menor a 3");
        }
    }

    rotation3DY(vector, angle) {
        if(vector instanceof Vector && vector.dim === 3){
            const matrizRotacao3DY = new Matrix(3, 3, [
                Math.cos(angle), 0, Math.sin(angle),
                0, 1, 0,
                -Math.sin(angle), 0, Math.cos(angle)

            ])

            const vetorEmFormaDeMatriz = new Matrix(3, 1, [
                vector.elements[0],
                vector.elements[1],
                vector.elements[2]
            ])

            const vetorResultadoEmFormaDeMatriz = this.algebra.dot(matrizRotacao3DY, vetorEmFormaDeMatriz);
            return new Vector(3, [Number(vetorResultadoEmFormaDeMatriz.elements[0].toFixed(3)), Number(vetorResultadoEmFormaDeMatriz.elements[1].toFixed(3)), Number(vetorResultadoEmFormaDeMatriz.elements[2].toFixed(3))]);



        }else{
            console.log("O argumento passado não é um vetor ou tem uma dimensão maior ou menor a 3")
        }
    }

    rotation3DZ(vector, angle) {
        if(vector instanceof Vector && vector.dim === 3){
            const matrizRotacao3DZ = new Matrix(3, 3, [
                Math.cos(angle), -Math.sin(angle), 0,
                Math.sin(angle), Math.cos(angle), 0,
                0, 0, 1
            ]);

            const vetorEmFormaDeMatriz = new Matrix(3, 1, [
                vector.elements[0],
                vector.elements[1],
                vector.elements[2]
            ]);

            const vetorResultadoEmFormaDeMatriz = this.algebra.dot(matrizRotacao3DZ, vetorEmFormaDeMatriz);
            return new Vector(3, [Number(vetorResultadoEmFormaDeMatriz.elements[0].toFixed(3)), Number(vetorResultadoEmFormaDeMatriz.elements[1].toFixed(3)), Number(vetorResultadoEmFormaDeMatriz.elements[2].toFixed(3))]);
        }else {
            console.log("O argumento passado não é um vetor ou tem uma dimensão maior ou menor a 3")
        }
    }

    reflection2DX(vector) {
        const reflectionMatrix = new Matrix(2, 2, [
            1, 0,
            0, -1
        ]);
        const vectorMatrix = new Matrix(2, 1, [vector.get(1), vector.get(2)]);
        const result = this.algebra.dot(reflectionMatrix, vectorMatrix);
        return new Vector(2, [
            Number(result.get(1, 1).toFixed(3)),
            Number(result.get(2, 1).toFixed(3))
        ]);
    }

    reflection2DY(vector) {
        const reflectionMatrix = new Matrix(2, 2, [
            -1, 0,
            0, 1
        ]);
        const vectorMatrix = new Matrix(2, 1, [vector.get(1), vector.get(2)]);
        const result = this.algebra.dot(reflectionMatrix, vectorMatrix);
        return new Vector(2, [
            Number(result.get(1, 1).toFixed(3)),
            Number(result.get(2, 1).toFixed(3))
        ]);
    }

    reflection3DX(vector) {
        const reflectionMatrix = new Matrix(3, 3, [
            1, 0, 0,
            0, -1, 0,
            0, 0, 1
        ]);
        const vectorMatrix = new Matrix(3, 1, [vector.get(1), vector.get(2), vector.get(3)]);
        const result = this.algebra.dot(reflectionMatrix, vectorMatrix);
        return new Vector(3, [
            Number(result.get(1, 1).toFixed(3)),
            Number(result.get(2, 1).toFixed(3)),
            Number(result.get(3, 1).toFixed(3))
        ]);
    }

    reflection3DY(vector) {
        const reflectionMatrix = new Matrix(3, 3, [
            -1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
        const vectorMatrix = new Matrix(3, 1, [vector.get(1), vector.get(2), vector.get(3)]);
        const result = this.algebra.dot(reflectionMatrix, vectorMatrix);
        return new Vector(3, [
            Number(result.get(1, 1).toFixed(3)),
            Number(result.get(2, 1).toFixed(3)),
            Number(result.get(3, 1).toFixed(3))
        ]);
    }

    reflection3DZ(vector) {
        const reflectionMatrix = new Matrix(3, 3, [
            -1, 0, 0,
            0, -1, 0,
            0, 0, 1
        ]);
        const vectorMatrix = new Matrix(3, 1, [vector.get(1), vector.get(2), vector.get(3)]);
        const result = this.algebra.dot(reflectionMatrix, vectorMatrix);
        return new Vector(3, [
            Number(result.get(1, 1).toFixed(3)),
            Number(result.get(2, 1).toFixed(3)),
            Number(result.get(3, 1).toFixed(3))
        ]);
    }

    projection2dx(vector){
        if (vector instanceof Vector || vector.dim === 2) {
            const matrizProjecao2DX = new Matrix(2, 2, [
                1, 0,
                0, 0
            ]);

            const vectorXEmFormaDeMatriz = new Matrix(2, 1, [
                vector.elements[0],
                0,
            ]);

            const calculo = new LinearAlgebra();
            const vetorResultado2DX = calculo.dot(matrizProjecao2DX, vectorXEmFormaDeMatriz);
            return new Vector(2, [
                Number(vetorResultado2DX.elements[0].toFixed(3)),
                Number(vetorResultado2DX.elements[1].toFixed(3))
            ]);
        }else {
            console.log("O argumento passado não é um vetor ou tem uma dimensão maior ou menor a 2");
        }
    }

    projection2dy(vector){
        if (vector instanceof Vector || vector.dim === 2) {
            const matrizProjecao2DY = new Matrix(2, 2, [
                0, 0,
                0, 1
            ]);

            const vectorYEmFormaDeMatriz = new Matrix(2, 1, [
                0,
                vector.elements[1],
            ]);

            const calculo = new LinearAlgebra();
            const vetorResultado2DY = calculo.dot(matrizProjecao2DY, vectorYEmFormaDeMatriz);
            return new Vector(2, [
                Number(vetorResultado2DY.elements[0].toFixed(3)),
                Number(vetorResultado2DY.elements[1].toFixed(3))
            ]);
        }else {
            console.log("O argumento passado não é um vetor ou tem uma dimensão maior ou menor a 2");
        }
    }

    projection3dx(vector){
        if (vector instanceof Vector || vector.dim === 3) {
            const matrizProjecao3DX = new Matrix(3, 3, [
                1, 0, 0,
                0, 0, 0,
                0, 0, 0
            ]);

            const vector3DXEmFormaDeMatriz = new Matrix(3, 1, [
                vector.elements[0],
                0,
                0,
            ]);

            const calculo = new LinearAlgebra();
            const vetorResultado3DX = calculo.dot(matrizProjecao3DX, vector3DXEmFormaDeMatriz);
            return new Vector(3, [
                Number(vetorResultado3DX.elements[0].toFixed(3)),
                Number(vetorResultado3DX.elements[1].toFixed(3)),
                Number(vetorResultado3DX.elements[2].toFixed(3))
            ]);
        }else {
            console.log("O argumento passado não é um vetor ou tem uma dimensão maior ou menor a 2");
        }
    }

    projection3dy(vector){
        if (vector instanceof Vector || vector.dim === 3) {
            const matrizProjecao3DY = new Matrix(3, 3, [
                0, 0, 0,
                0, 1, 0,
                0, 0, 0
            ]);

            const vector3DYEmFormaDeMatriz = new Matrix(3, 1, [
                0,
                vector.elements[1],
                0,
            ]);

            const calculo = new LinearAlgebra();
            const vetorResultado3DY = calculo.dot(matrizProjecao3DY, vector3DYEmFormaDeMatriz);
            return new Vector(3, [
                Number(vetorResultado3DY.elements[0].toFixed(3)),
                Number(vetorResultado3DY.elements[1].toFixed(3)),
                Number(vetorResultado3DY.elements[2].toFixed(3))
            ]);
        }else {
            console.log("O argumento passado não é um vetor ou tem uma dimensão maior ou menor a 2");
        }
    }

    projection3dz(vector){
        if (vector instanceof Vector || vector.dim === 3) {
            const matrizProjecao3DZ = new Matrix(3, 3, [
                0, 0, 0,
                0, 0, 0,
                0, 0, 1
            ]);

            const vector3DZEmFormaDeMatriz = new Matrix(3, 1, [
                0,
                0,
                vector.elements[2],
            ]);

            const calculo = new LinearAlgebra();
            const vetorResultado3DZ = calculo.dot(matrizProjecao3DZ, vector3DZEmFormaDeMatriz);
            return new Vector(3, [
                Number(vetorResultado3DZ.elements[0].toFixed(3)),
                Number(vetorResultado3DZ.elements[1].toFixed(3)),
                Number(vetorResultado3DZ.elements[2].toFixed(3))
            ]);
        }else {
            console.log("O argumento passado não é um vetor ou tem uma dimensão maior ou menor a 2");
        }
    }

    shearing(vector, kx, ky) {
        if(vector instanceof Vector){
            const matrizCis = new Matrix(2,2,[
                1, kx,
                ky, 1
            ]);

            const vetorEmFormaDeMatriz = new Matrix(2,1, [
                vector.elements[0],
                vector.elements[1]
            ])

            const caulculoCisalhamento = new LinearAlgebra()
            const MatrixResultante = caulculoCisalhamento.dot(matrizCis, vetorEmFormaDeMatriz)
            return new Vector(2,[Number(MatrixResultante.elements[0]), Number(MatrixResultante.elements[1])])
        }
    }




}

class Buscador {
    quest(A) {
        const algebra = new LinearAlgebra();
        if (!(A instanceof Matrix)) {
            throw new Error("O argumento deve ser uma instância de Matrix");
        }

        const TOLERANCE = Math.pow(10, -10);

        let a0Elements = new Array(A.cols).fill(0);
        for (let j = 0; j < A.cols; j++) {
            for (let i = 0; i < A.rows; i++) {
                a0Elements[j] += A.get(i + 1, j + 1);
            }
        }
        let a0 = new Vector(A.cols, a0Elements);

        let h0Elements = new Array(A.rows).fill(0);
        for (let i = 0; i < A.rows; i++) {
            for (let j = 0; j < A.cols; j++) {
                h0Elements[i] += A.get(i + 1, j + 1);
            }
        }
        let h0 = new Vector(A.rows, h0Elements);

        const At = algebra.transpose(A);
        const norm = (elements) =>
            Math.sqrt(elements.reduce((acc, val) => acc + val * val, 0));

        let previousA0 = null;
        let convergence = false;

        while (!convergence) {
            const mulhi = algebra.dot(A, new Matrix(A.cols, 1, a0.elements));
            const mulai = algebra.dot(At, new Matrix(A.rows, 1, h0.elements));

            if (!mulhi || !mulai) {
                console.error("Erro durante a multiplicação das matrizes.");
                return null;
            }

            const hi = mulhi.elements.map((el) => el / norm(mulhi.elements));
            const ai = mulai.elements.map((el) => el / norm(mulai.elements));

            if (previousA0) {
                const error = Math.max(...ai.map((val, idx) => 
                    Math.abs(val - previousA0[idx])));
                if (error < TOLERANCE) {
                    convergence = true;
                }
            }

            previousA0 = [...ai];
            h0 = new Vector(hi.length, hi);
            a0 = new Vector(ai.length, ai);
        }

        const ranking = a0.elements.map((value, index) => ({
            site: index + 1,
            score: value
        }));

        ranking.sort((a, b) => b.score - a.score);

        console.log("\nPAGE RANK RESULTS:");
        console.log("------------------");
        ranking.forEach((site, index) => {
            console.log(`Rank ${index + 1}: Site ${site.site} (Score: ${site.score.toFixed(10)})`);
        });

        return {
            scores: a0.elements,
            ranking: ranking
        };
    }
}

const pageRank = new Buscador();
const matrix = new Matrix(10, 10, [
    0, 1, 1, 0, 1, 1, 0, 0, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
    0, 0, 0, 0, 0, 1, 0, 0, 1, 0,
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 1, 1, 0, 0, 1, 0, 1, 0, 1,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0
]);

const result = pageRank.quest(matrix);
