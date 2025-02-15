export default {
    props: ['name', 'description', 'price'],
    template: `
    <div style="background: white; padding: 15px; border-radius: 10px; text-align: center; box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1); transition: transform 0.2s ease-in-out; width: 200px;">
        <h3 @click="$router.push('/service/' + name)"> {{ name }} </h3>
        <p> {{ description }} </p>
    </div>
    `,
}