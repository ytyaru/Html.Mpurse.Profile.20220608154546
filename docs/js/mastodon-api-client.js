class MastodonApiClient extends MastodonRestClient {
    constructor(domain, accessToken) {
        super(domain)
        //this.client = new MastodonRestClient(domain)
        this.accessToken = accessToken
    }
    get #AuthHeader() { return {'Authorization': `Bearer ${this.accessToken}`} }
    #headers(headers=null) { return (headers) ? {...this.#AuthHeader, ...headers} : this.#AuthHeader }
    async verify(status) {
        console.debug('----- verify_credentials -----')
        return await this.get('api/v1/apps/verify_credentials', this.#AuthHeader, null)
    }
    async instance(status) {
        console.debug('----- verify_credentials -----')
        return await this.get('api/v1/instance', null, null)
    }
    async toot(status) {
        console.debug('----- toot -----')
        console.debug('status:', status)
        const params = {status: status};
        return await this.post('api/v1/statuses', this.#AuthHeader, params)
    }
}
