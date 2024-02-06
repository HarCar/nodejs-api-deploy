export class PagesRepository {
  constructor ({ context, sessionData }) {
    this._context = context
    this._sessionData = sessionData
    this._collection = context.collection('pages')
  }

  Get = async () => {
    return await this._collection.find({}).toArray()
  }

  Insert = async () => {
    await this._collection.insertOne({ name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: 'ChartPieIcon' })
    await this._collection.insertOne({ name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: 'CursorArrowRaysIcon' })
    await this._collection.insertOne({ name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: 'FingerPrintIcon' })
    await this._collection.insertOne({ name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: 'SquaresPlusIcon' })
    await this._collection.insertOne({ name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: 'ArrowPathIcon' })
  }
}
