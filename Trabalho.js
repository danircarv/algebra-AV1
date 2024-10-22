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

// Test for translate2D
console.log("Testing translate2D");
let vector2D = new Vector(2, [1, 2]);
let dx = 3, dy = 4;
let result = new Transformation().translate2D(vector2D, dx, dy);
console.log(`translate2D(${vector2D.elements}, ${dx}, ${dy}) = ${result.elements}`); // Expected: [4, 6]

// Test for translate3D
console.log("Testing translate3D");
let vector3D = new Vector(3, [1, 2, 3]);
let dz = 5;
result = new Transformation().translate3D(vector3D, dx, dy, dz);
console.log(`translate3D(${vector3D.elements}, ${dx}, ${dy}, ${dz}) = ${result.elements}`); // Expected: [4, 6, 8]

// Test for rotation2D
console.log("Testing rotation2D");
vector2D = new Vector(2, [1, 0]);
let angle = Math.PI / 2;
result = new Transformation().rotation2D(vector2D, angle);
console.log(`rotation2D(${vector2D.elements}, ${angle}) = ${result.elements}`); // Expected: [0, 1]

// Test for rotation3DX
console.log("Testing rotation3DX");
vector3D = new Vector(3, [1, 0, 0]);
result = new Transformation().rotation3DX(vector3D, angle);
console.log(`rotation3DX(${vector3D.elements}, ${angle}) = ${result.elements}`); // Expected: [1, 0, 0]

// Test for rotation3DY
console.log("Testing rotation3DY");
vector3D = new Vector(3, [0, 1, 0]);
result = new Transformation().rotation3DY(vector3D, angle);
console.log(`rotation3DY(${vector3D.elements}, ${angle}) = ${result.elements}`); // Expected: [0, 1, 0]

// Test for rotation3DZ
console.log("Testing rotation3DZ");
vector3D = new Vector(3, [0, 0, 1]);
result = new Transformation().rotation3DZ(vector3D, angle);
console.log(`rotation3DZ(${vector3D.elements}, ${angle}) = ${result.elements}`); // Expected: [0, 0, 1]

// Test for reflection2DX
console.log("Testing reflection2DX");
vector2D = new Vector(2, [1, 2]);
result = new Transformation().reflection2DX(vector2D);
console.log(`reflection2DX(${vector2D.elements}) = ${result.elements}`); // Expected: [1, -2]

// Test for reflection2DY
console.log("Testing reflection2DY");
vector2D = new Vector(2, [1, 2]);
result = new Transformation().reflection2DY(vector2D);
console.log(`reflection2DY(${vector2D.elements}) = ${result.elements}`); // Expected: [-1, 2]

// Test for reflection3DX
console.log("Testing reflection3DX");
vector3D = new Vector(3, [1, 2, 3]);
result = new Transformation().reflection3DX(vector3D);
console.log(`reflection3DX(${vector3D.elements}) = ${result.elements}`); // Expected: [1, -2, 3]

// Test for reflection3DY
console.log("Testing reflection3DY");
vector3D = new Vector(3, [1, 2, 3]);
result = new Transformation().reflection3DY(vector3D);
console.log(`reflection3DY(${vector3D.elements}) = ${result.elements}`); // Expected: [-1, 2, 3]

// Test for reflection3DZ
console.log("Testing reflection3DZ");
vector3D = new Vector(3, [1, 2, 3]);
result = new Transformation().reflection3DZ(vector3D);
console.log(`reflection3DZ(${vector3D.elements}) = ${result.elements}`); // Expected: [-1, -2, 3]

// Test for projection2dx
console.log("Testing projection2dx");
vector2D = new Vector(2, [1, 2]);
result = new Transformation().projection2dx(vector2D);
console.log(`projection2dx(${vector2D.elements}) = ${result.elements}`); // Expected: [1, 0]

// Test for projection2dy
console.log("Testing projection2dy");
vector2D = new Vector(2, [1, 2]);
result = new Transformation().projection2dy(vector2D);
console.log(`projection2dy(${vector2D.elements}) = ${result.elements}`); // Expected: [0, 2]

// Test for projection3dx
console.log("Testing projection3dx");
vector3D = new Vector(3, [1, 2, 3]);
result = new Transformation().projection3dx(vector3D);
console.log(`projection3dx(${vector3D.elements}) = ${result.elements}`); // Expected: [1, 0, 0]

// Test for projection3dy
console.log("Testing projection3dy");
vector3D = new Vector(3, [1, 2, 3]);
result = new Transformation().projection3dy(vector3D);
console.log(`projection3dy(${vector3D.elements}) = ${result.elements}`); // Expected: [0, 2, 0]

// Test for projection3dz
console.log("Testing projection3dz");
vector3D = new Vector(3, [1, 2, 3]);
result = new Transformation().projection3dz(vector3D);
console.log(`projection3dz(${vector3D.elements}) = ${result.elements}`); // Expected: [0, 0, 3]

// Test for shearing
console.log("Testing shearing");
vector2D = new Vector(2, [1, 2]);
let kx = 1, ky = 1;
result = new Transformation().shearing(vector2D, kx, ky);
console.log(`shearing(${vector2D.elements}, ${kx}, ${ky}) = ${result.elements}`); // Expected: [3, 3]



