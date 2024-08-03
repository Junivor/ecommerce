export default class TemplateRepository {
    static findByTemplateName(template_name) {
        return this.findOne({ template_name })
    }
}