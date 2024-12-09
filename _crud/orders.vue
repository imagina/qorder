<template></template>
<script>

export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qorder.entityNames.orders"),
        apiRoute: 'apiRoutes.qorder.orders',
        permission: 'iorder.orders',
        create: {
          title: this.$tr('iorder.cms.newOrder'),
        },
        read: {
          columns: [],
          requestParams: {
            include: 'suppliers.supplier',
          },
        },
        update: {
          title: this.$tr('iorder.cms.updateOrder'),
          requestParams: {
            include: 'suppliers.supplier',
          },
        },
        delete: true,
        formLeft: {
          id: { value: '' },
          userId: { value: this.$store.state.quserAuth.userId },
          title: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          slug: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.slug')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          description: {
            name: "description",
            value: '',
            type: 'html',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.description')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          summary: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.summary')}*`,
              type: 'textarea',
              rows: "3",
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
        },
        formRight: {
          /* status */
          status: {
            value: "1",
            type: 'select',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.status')}`,
              clearable: false,
              options: [
                { label: this.$tr('isite.cms.label.enabled'), value: "1" },
                { label: this.$tr('isite.cms.label.disabled'), value: "0" }
              ]
            }
          },

          categoryId: {
            type: 'crud',
            permission: 'iappointment.appointments.edit-all',
            props: {
              crudType: 'select',
              crudData: import('modules/qappointment/_crud/categories'),
              crudProps: {
                label: `${this.$tr('isite.cms.form.category')}*`,
                rules: [
                  //  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
              config: {
                options: {
                  label: 'title', value: 'id'
                }
              }
            },
          },

          sku: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.sku')}*`,
              rules: [
                // val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },

          reference: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.reference')}*`,
              rules: [
                //val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },

          featured: {
            value: '0',
            type: 'checkbox',
            props: {
              label: this.$tr('iblog.cms.form.featured'),
              trueValue: '1',
              falseValue: '0',
            }
          },

          isInternal: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.type'),
              clearable: true,
              options: [
                { label: this.$tr('isite.cms.label.internal'), value: 1 },
                { label: this.$tr('isite.cms.label.external'), value: 0 },
              ],
            }
          },
        },
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
