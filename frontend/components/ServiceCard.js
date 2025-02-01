export default {
    props : ['name', 'description', 'price'],
    template : `
    <div class="jumbotron">
        <h2 @click="$router.push('/service/' + name)"> {{name}} </h2>
        <p> {{description}} </p>
        <hr>
        <p> Price : {{price}}</p>
    </div>
    `,
}