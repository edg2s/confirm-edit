mw.loader.using( 'mediawiki.util', function () {
	$( document ).ready( function () {
		var $confirmCheckbox, $save,
			label = 'Tick this box to confirm you wish to make this edit with your staff account.',
			isEditPage = !!$( '#editform' ).length;

		function createOouiCheckbox( $container ) {
			var confirmCheckbox = new OO.ui.CheckboxInputWidget(),
				fieldLayout = new OO.ui.FieldLayout( confirmCheckbox, {
					align: 'inline',
					label: $( '<strong>' ).text( label )
				} );

			$container.append( fieldLayout.$element );
			confirmCheckbox.fieldLayout = fieldLayout;

			return confirmCheckbox;
		}

		if ( isEditPage ) {
			$save = $( '#wpSave' );

			if ( $( '#editform' ).hasClass( 'mw-editform-ooui' ) ) {
				// OOUI edit form
				mw.loader.using( 'oojs-ui' ).then( function () {
					var checkbox = createOouiCheckbox( $( '.editCheckboxes > .oo-ui-horizontalLayout' ) ),
						saveButton = OO.ui.infuse( $save );

					saveButton.setDisabled( true );
					checkbox.on( 'change', function ( value ) {
						saveButton.setDisabled( !value );
					} );
				} );
			} else {
				// Legacy edit form
				$confirmCheckbox = $( '<input name="confirmEdit" type="checkbox" />' );
				$( '.editCheckboxes' ).append(
					'&nbsp;',
					$( '<label>' ).append(
						$confirmCheckbox,
						'&nbsp;',
						$( '<strong>' ).text( label )
					)
				);
				$save.prop( 'disabled', true );
				$confirmCheckbox.on( 'click', function () {
					$save.prop( 'disabled', !$confirmCheckbox.prop( 'checked' ) );
				} );
			}
		}

		// VE support
		mw.hook( 've.saveDialog.stateChanged' ).add( function () {
			var saveDialog = ve.init.target.saveDialog,
				$saveCheckboxes = saveDialog.$saveCheckboxes;

			if ( !saveDialog.confirmCheckbox ) {
				saveDialog.getActions().setAbilities( { save: false } );
				saveDialog.confirmCheckbox = createOouiCheckbox( $saveCheckboxes ).on( 'change', function ( value ) {
					saveDialog.getActions().setAbilities( { save: value } );
				} );
			} else {
				$saveCheckboxes.append( saveDialog.confirmCheckbox.fieldLayout.$element );
			}
		} );
	} );
} );
