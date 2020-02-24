export default {
	key: 'ExampleJob',
	async handle() {
		// Função executando quando o Job for chamado na fila
		console.log('Example Job Working');
	},
};
