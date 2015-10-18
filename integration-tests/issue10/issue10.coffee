Data = new Mongo.Collection 'content'

if Meteor.isServer
  Meteor.startup () ->
    Meteor.publish 'content', () ->
      return Data.find()
    return true
  return true

if Meteor.isClient
  Meteor.subscribe('content')
  
  tpl = Template['issue10']
  
  showAddPanel = (tpl) ->
    tpl.$('.page').addClass('addpanel-expanded')
    return true
  hideAddPanel = (tpl) ->
    tpl.$('.page').removeClass('addpanel-expanded')
    return true
  resetAddPanel = (tpl) ->
    tpl.$('.addpanel .input-add-name').val(null)
    tpl.$('.addpanel .input-add-content').attr('rows', 1).val(null)
    tpl.$('.addpanel .input-add-keywords').attr('rows', 1).val(null)
    return true
  focusAddPanel = (tpl) ->
    tpl.$('.addpanel .input-add-name').focus()
    return true
  
  checkMDLCheckbox = ($mdlCheckbox, checked) ->
    $mdlCheckbox.find('input[type=checkbox]').prop('checked', checked)
    $mdlCheckbox[if checked then 'addClass' else 'removeClass']('is-checked')
    return true
  
  tpl.onRendered (tpl) ->
    tpl = this
    return true
  #tpl.onRendered/
  
  tpl.helpers
    data: () ->
      return Data.find()
  
  tpl.events
    'change .toggle-visibility': (event, tpl) ->
      target = event.currentTarget
      _id = target.getAttribute('data-id')
      visible = target.checked
      #console.log(_id, visible)
      Data.update _id, $set: visible: visible
      return false
    'click .button-delete': (event, tpl) ->
      target = event.currentTarget
      _id = target.getAttribute('data-id')
      if target.classList.contains('is-primed')
        #console.warn('delete', _id)
        Data.remove _id
      else
        target.classList.add('is-primed')
      return false
    'mouseout .button-delete': (event, tpl) ->
      target = event.currentTarget
      if target.classList.contains('is-primed')
        target.classList.remove('is-primed')
      return false
    'click .button-add': (event, tpl) ->
      showAddPanel(tpl)
      focusAddPanel(tpl)
      return false
    'input .addpanel textarea': (event, tpl) ->
      console.log('change .addpanel textarea')
      target = event.currentTarget
      newRows = target.value.split('\n').length
      target.rows = newRows if target.rows != newRows
      if target.rows > 1
        target.classList.add('is-fat')
      else
        target.classList.remove('is-fat')
      return false
    'click .addpanel .button-cancel': (event, tpl) ->
      resetAddPanel(tpl)
      hideAddPanel(tpl)
      return false
    'submit .addpanel': (event, tpl) ->
      event.preventDefault()
      $form = tpl.$(event.currentTarget)
      name = String($form.find('.input-add-name').val()).trim()
      content = String($form.find('.input-add-content').val()).trim()
      keywords = String($form.find('.input-add-keywords').val()).trim().split('\n')
      visible = $form.find('.input-add-visible').prop('checked')
      if name.length == 0
        focusAddPanel(tpl)
      else
        Data.insert {
          "name": name
          "content": content
          "keywords": keywords
          "visible": visible
        }
        resetAddPanel(tpl)
        hideAddPanel(tpl)
      return false
    'change .mdl-data-table > thead > tr > th >\
      .mdl-data-table__select > input[type=checkbox]': (event, tpl) ->
      console.log('head checkbox change')
      $target = $(event.currentTarget)
      checked = $target.prop('checked')
      $table = $target.closest('.mdl-data-table')
      return false if !$table
      $mdlCheckboxes = $table.find('tbody > tr > td >\
        .mdl-checkbox.mdl-data-table__select')
      checkMDLCheckbox($mdlCheckboxes, checked)
      checkedRows = if checked then $mdlCheckboxes.closest('tr').toArray() else []
      $table.trigger('selectionChange', checkedRows)
      return false
    'change .mdl-data-table > tbody > tr > td >\
      .mdl-data-table__select > input[type=checkbox]': (event, tpl) ->
      console.log('body checkbox change')
      $target = $(event.currentTarget)
      checked = $target.prop('checked')
      $table = $target.closest('.mdl-data-table')
      return false if !$table
      $headMdlCheckbox = $table.find('thead > tr > th >\
        .mdl-checkbox.mdl-data-table__select')
      $allRows = $table.find('tbody > tr > td >\
        .mdl-checkbox.mdl-data-table__select').closest('tr')
      $checkedRows = $table.find('tbody > tr > td >\
        .mdl-checkbox.mdl-data-table__select.is-checked').closest('tr')
      if $allRows.length == $checkedRows.length
        checkMDLCheckbox($headMdlCheckbox, true)
      else
        checkMDLCheckbox($headMdlCheckbox, false)
      checkedRows = $checkedRows.toArray()
      $table.trigger('selectionChange', checkedRows)
      return false
