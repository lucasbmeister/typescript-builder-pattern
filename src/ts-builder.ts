type FunctionType = (...args: any[]) => any

type SetterProperty<TObject, Property extends keyof TObject> = TObject[Property] extends FunctionType ? never : Property

type BuilderSetters<
	TObject
> = {
		[Property in keyof TObject as SetterProperty<TObject, Property>]-?: (value: TObject[Property]) => BuilderType<TObject>
	};

type BuilderType<TObject> = {
	build(): TObject
} & BuilderSetters<TObject>


interface Constructable<T = any> {
	new(...params: any[]): T;
}

/**
 * A classe Builder é uma classe genérica que pode ser usada para construir objetos do tipo T.
 *
 * @template {T} - O tipo de objeto a ser construído.
 */
export class Builder<T> {

	private instance!: T

	/**
     * Cria uma nova instância da classe Builder.
     *
     * @param {T} instance - A instância do tipo T a ser construída.
     */
	constructor(instance: T) {
		this.instance = instance
	}
	
	/**
     * Cria uma nova instância de Builder do tipo T.
     *
     * @static
     * @returns {BuilderType<T>} Uma nova instância de Builder do tipo T.
     */
	public static builder<T extends object>(this: Constructable<T>): BuilderType<T> {
		const instance = new this()
		const builder = new Builder(instance)
		const proxy = new Proxy(builder, {

			get(target, property, receiver) {
				const stringProperty = property.toString()

				if (stringProperty.includes('build')) {
					return () => {
						return target.build()
					}
				} else {
					return (value: any) => {
						target.instance[stringProperty as keyof typeof target.instance] = value
						return receiver
					}
				}
			}
		}) as unknown as BuilderType<T>
		return proxy
	}

	/**
	 * Constrói e retorna uma instância do tipo T.
	 *
	 * @return {T} A instância construída do tipo T.
	 */
	build(): T {
		const instance = this.instance as any
		delete instance['instance']
		return this.instance
	}

}