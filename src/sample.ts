import { Builder } from './ts-builder'

class SampleRequest extends Builder<SampleRequest> {

	url!: string
	headers?: Record<string, string> | undefined
	data?: any
	method!: 'POST' | 'PUT'
	teste() {
		console.log(this.data)
	}
}


const value = SampleRequest
	.builder()
	.method('POST')
	.headers({ teste: '' })
	.data({ teste: '123' })
	.build()

console.log(value)

value.teste()