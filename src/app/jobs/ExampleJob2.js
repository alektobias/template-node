export default {
	key: 'ExampleJob2',
	async handle() {
		// Função executando quando o Job for chamado na fila
		console.log('Example Job 2 Working');
	},
};
