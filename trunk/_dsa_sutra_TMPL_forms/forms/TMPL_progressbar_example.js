/**
 *
 * @properties={typeid:24,uuid:"2846969d-d754-494a-ba8b-9588015a293a"}
 */
function INDEFINITE_start()
{
globals.CALLBACK_progressbar_start(null)
}

/**
 *
 * @properties={typeid:24,uuid:"50179bef-a5de-4b5b-8fc5-76e1f1e331fd"}
 */
function INDEFINITE_start_gfx()
{
globals.CALLBACK_progressbar_start(-273)
}

/**
 *
 * @properties={typeid:24,uuid:"a42439d0-205f-4bb0-8b77-30387ee1df56"}
 */
function INDEFINITE_stop()
{
globals.CALLBACK_progressbar_stop()
}

/**
 *
 * @properties={typeid:24,uuid:"1fcff881-57df-46ab-99eb-aa92c6ef344a"}
 */
function NORMAL_start()
{

//base
//globals.CALLBACK_progressbar_start()

//more advanced
globals.CALLBACK_progressbar_start(10,'This is 10 percent',"No I'm not, I'm a tooltip")

globals.TMPL_progressbar = 10
}

/**
 *
 * @properties={typeid:24,uuid:"5c4341ac-dbcc-4529-b184-40fd5200c611"}
 */
function NORMAL_stop()
{
globals.CALLBACK_progressbar_stop()
}

/**
 *
 * @properties={typeid:24,uuid:"5c2447be-361a-457c-9a40-b2ef01e48b63"}
 */
function NORMAL_update()
{

//no text
//globals.CALLBACK_progressbar_set(globals.test += 10)


//text
globals.CALLBACK_progressbar_set(globals.TMPL_progressbar += 10,'Check out my new value!!!  '+ globals.TMPL_progressbar)
}
