(function() {
  //const hostname = 'http://192.168.2.133:8080'
  const hostname = ''

  const { createApp } = Vue

  const app = createApp
  ({
    data()
    {
      return {
        linkType: [
          'SIMPLE_PIN',
          'SCHEDULED_PIN',
          'INTERRUPT_PIN',
        ],
        links: [],
        showEditLink: false,
        editLinkHead: '',
        workingLink: {
          name: '',
          index: -1,
          type: -1,
          pin: {
            num: -1,
            state: false,
          },
          interruptPin: {
            num: -1,
            msDelay: 0,
            responseType: -1,
            pin: {
              num: -1,
              state: false,
            }
          },
        },
      }
    },
    async mounted()
    {
      let res = await axios.get( `${ hostname }/links`, { headers: { 'Referer': null, 'Origin': null } } )

      this.links = res.data
    },
    methods:
    {
      newLink()
      {
        this.showEditLink = true
        this.editLinkHead = 'New Pin'
        this.workingLink.index = -1
        this.workingLink.name = ''
        this.workingLink.type = 0
      },
      editLink( link )
      {
        console.log( link );

        this.showEditLink = true
        this.workingLinkHead = link.name
        this.workingLink.index = link.index
        this.workingLink.name = link.name
        this.workingLink.type = link.type

        switch ( this.linkType[link.type] )
        {
          case 'SIMPLE_PIN':
            this.workingLink.pin = {
              num: link.pin.num,
              state: link.pin.state,
            }

            break;
          case 'INTERRUPT_PIN':
            this.workingLink.interruptPin = {
              num: link.interruptPin.num,
              msDelay: link.interruptPin.msDelay,
              responseType: link.interruptPin.responseType,
            }

            switch ( this.linkType[this.workingLink.interruptPin.responseType] )
            {
              case 'SIMPLE_PIN':
                this.workingLink.interruptPin.pin = {
                  num: this.workingLink.interruptPin.pin.num,
                  state: this.workingLink.interruptPin.pin.state,
                }

                break;
            }

            break;
        }
      },
      async saveLink()
      {
        let link = {}

        link.name = this.workingLink.name
        link.type = parseInt( this.workingLink.type )
        link.index = this.workingLink.index

        if ( link.index == -1 )
        {
          link.index = this.links.length
          this.links.push( link )
        }
        else
        {
          this.links[link.index].name = link.name
          this.links[link.index].type = link.type
        }

        switch ( this.linkType[link.type] )
        {
          case 'SIMPLE_PIN':
            link.pin = {
              num: this.workingLink.pin.num,
              state: this.workingLink.pin.state,
            }

            break;
          case 'INTERRUPT_PIN':
            link.interruptPin = {
              num: this.workingLink.interruptPin.num,
              msDelay: this.workingLink.interruptPin.msDelay,
              responseType: parseInt( this.workingLink.interruptPin.responseType ),
            }

            switch ( this.linkType[link.interruptPin.responseType] )
            {
              case 'SIMPLE_PIN':
                link.interruptPin.pin = {
                  num: this.workingLink.interruptPin.pin.num,
                  state: this.workingLink.interruptPin.pin.state,
                }

                break;
            }

            break;
        }

        console.log( link )

        let res = await axios.post( `${ hostname }/links`, link, { headers: { 'Referer': null, 'Origin': null } } )

        if ( res.status != 200 && res.status != 201 )
        {
          console.log( 'failed to post new link' )
          console.log( res )
        }
        else
        {
          if ( link.index == this.links.length )
          {
            this.links.push( link )
          }
          else
          {
            this.links[link.index].name = link.name
            this.links[link.index].type = link.type

            switch ( this.linkType[link.type] )
            {
              case 'SIMPLE_PIN':
                this.links[link.index].pin.num = link.pin.num
                this.links[link.index].pin.state = link.pin.state
                break;
            }
          }

          this.showEditLink = false
        }
      },
      async simplePinToggle( link )
      {
        link.pin.state = !link.pin.state

        let res = await axios.post( `${ hostname }/links`, link, { headers: { 'Referer': null, 'Origin': null } } )

        if ( res.status != 200 && res.status != 201 )
        {
          console.log( 'failed to toggle pin' )
          console.log( res )
        }
      },
      closeEditLink()
      {
        this.showEditLink = false
      }
    }
  })

  app.mount( '#app' );
})();
